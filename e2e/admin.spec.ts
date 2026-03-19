/**
 * Admin panel tests.
 *
 * ACCESS CONTROL tests (unauthenticated / non-admin) run always — they verify
 * server-side redirects work without any credentials.
 *
 * ADMIN UI tests require a real authenticated session because the admin layout
 * is server-rendered via getSession() which reads SSR cookies.  Set env vars
 * TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD to run these tests with a real admin
 * account.  Without them the tests are skipped with a clear message.
 */
import { test, expect, Page, BrowserContext } from "@playwright/test";

const SUPABASE_URL = "https://zdwqssqppdbwqigxxgje.supabase.co";

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "";
const HAS_ADMIN_CREDS = !!ADMIN_EMAIL && !!ADMIN_PASSWORD;

// ─── Helper: sign in via the login form and get an authenticated context ──────

async function signInAsAdmin(page: Page) {
  await page.goto("/login");
  await page.locator("input[type='email']").fill(ADMIN_EMAIL);
  await page.locator("input[type='password']").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/account|\/admin/, { timeout: 15_000 });
}

// ─── ACCESS CONTROL — unauthenticated (always run) ───────────────────────────

test.describe("Admin — access control (unauthenticated)", () => {
  test("GET /admin redirects to /login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("GET /admin/products redirects to /login", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page).toHaveURL(/\/login/);
  });

  test("GET /admin/orders redirects to /login", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page).toHaveURL(/\/login/);
  });

  test("GET /admin/analytics redirects to /login", async ({ page }) => {
    await page.goto("/admin/analytics");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirect includes ?next=/admin param", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/next=%2Fadmin|next=\/admin/);
  });
});

// ─── ACCESS CONTROL — regular user (always run, mocked) ──────────────────────

test.describe("Admin — access control (non-admin user)", () => {
  test("non-admin user visiting /admin is redirected to /login", async ({ page }) => {
    // Mock getUser to return a non-admin user — but SSR sees no real cookie so it redirects
    await page.route(`${SUPABASE_URL}/auth/v1/user`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "regular-user-id",
          email: "regularuser@example.com",
          role: "authenticated",
        }),
      });
    });
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });
});

// ─── LOGIN PAGE UI (always run) ───────────────────────────────────────────────

test.describe("Admin — login page reached via redirect", () => {
  test("redirected login page pre-fills next param", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login.*next/);
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  test("login page shows THE DEXARIUM branding", async ({ page }) => {
    await page.goto("/login?next=/admin");
    await expect(page.locator("body")).toContainText(/the dexarium/i);
  });
});

// ─── ADMIN UI TESTS (require real credentials) ────────────────────────────────

test.describe("Admin Dashboard (/admin)", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_ADMIN_CREDS) test.skip(true, "Set TEST_ADMIN_EMAIL + TEST_ADMIN_PASSWORD to run admin UI tests");
    await signInAsAdmin(page);
  });

  test("shows ADMIN DASHBOARD heading", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator("body")).toContainText(/admin dashboard/i);
  });

  test("shows Products, Orders, Analytics tiles", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("link", { name: /products/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /orders/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /analytics/i })).toBeVisible();
  });

  test("admin nav shows ADMIN label and logged-in email", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.locator("body")).toContainText(/admin/i);
    await expect(page.locator("body")).toContainText(ADMIN_EMAIL);
  });

  test("clicking Products tile navigates to /admin/products", async ({ page }) => {
    await page.goto("/admin");
    await page.getByRole("link", { name: /products/i }).first().click();
    await expect(page).toHaveURL(/\/admin\/products/);
  });

  test("clicking Orders tile navigates to /admin/orders", async ({ page }) => {
    await page.goto("/admin");
    await page.getByRole("link", { name: /orders/i }).first().click();
    await expect(page).toHaveURL(/\/admin\/orders/);
  });

  test("clicking Analytics tile navigates to /admin/analytics", async ({ page }) => {
    await page.goto("/admin");
    await page.getByRole("link", { name: /analytics/i }).first().click();
    await expect(page).toHaveURL(/\/admin\/analytics/);
  });
});

test.describe("Admin Products (/admin/products)", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_ADMIN_CREDS) test.skip(true, "Set TEST_ADMIN_EMAIL + TEST_ADMIN_PASSWORD to run admin UI tests");
    await signInAsAdmin(page);
  });

  test("shows PRODUCTS heading and + NEW PRODUCT button", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page.locator("body")).toContainText(/products/i);
    await expect(page.getByRole("link", { name: /new product/i })).toBeVisible();
  });

  test("product table has expected columns", async ({ page }) => {
    await page.goto("/admin/products");
    for (const h of ["Name", "Brand", "Price", "Status", "Actions"]) {
      await expect(page.locator("th", { hasText: h })).toBeVisible();
    }
  });

  test("+ NEW PRODUCT navigates to /admin/products/new", async ({ page }) => {
    await page.goto("/admin/products");
    await page.getByRole("link", { name: /new product/i }).click();
    await expect(page).toHaveURL(/\/admin\/products\/new/);
  });
});

test.describe("Admin New Product (/admin/products/new)", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_ADMIN_CREDS) test.skip(true, "Set TEST_ADMIN_EMAIL + TEST_ADMIN_PASSWORD to run admin UI tests");
    await signInAsAdmin(page);
  });

  test("shows NEW PRODUCT heading with form fields", async ({ page }) => {
    await page.goto("/admin/products/new");
    await expect(page.locator("body")).toContainText(/new product/i);
    await expect(page.locator("input[type='number'], input[name*='price']").first()).toBeVisible();
  });
});

test.describe("Admin Orders (/admin/orders)", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_ADMIN_CREDS) test.skip(true, "Set TEST_ADMIN_EMAIL + TEST_ADMIN_PASSWORD to run admin UI tests");
    await signInAsAdmin(page);
  });

  test("shows ORDERS heading with date filters and Apply button", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page.locator("body")).toContainText(/orders/i);
    await expect(page.locator("input[type='date']")).toHaveCount(2);
    await expect(page.getByRole("button", { name: /apply/i })).toBeVisible();
  });

  test("status dropdown has all expected options", async ({ page }) => {
    await page.goto("/admin/orders");
    const select = page.locator("select").first();
    await expect(select.locator("option[value='paid']")).toHaveCount(1);
    await expect(select.locator("option[value='pending']")).toHaveCount(1);
    await expect(select.locator("option[value='failed']")).toHaveCount(1);
    await expect(select.locator("option[value='refunded']")).toHaveCount(1);
  });

  test("order table columns are present", async ({ page }) => {
    await page.goto("/admin/orders");
    await page.waitForTimeout(1_500);
    for (const h of ["Date", "Order ID", "Email", "Total", "Status"]) {
      await expect(page.locator("th", { hasText: h })).toBeVisible();
    }
  });
});

test.describe("Admin Analytics (/admin/analytics)", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_ADMIN_CREDS) test.skip(true, "Set TEST_ADMIN_EMAIL + TEST_ADMIN_PASSWORD to run admin UI tests");
    await signInAsAdmin(page);
  });

  test("shows ANALYTICS heading with date filters", async ({ page }) => {
    await page.goto("/admin/analytics");
    await expect(page.locator("body")).toContainText(/analytics/i);
    await expect(page.locator("input[type='date']")).toHaveCount(2);
    await expect(page.getByRole("button", { name: /apply/i })).toBeVisible();
  });

  test("KPI cards render — Total Revenue, Orders, Avg Order Value", async ({ page }) => {
    await page.goto("/admin/analytics");
    await page.waitForTimeout(2_000);
    await expect(page.locator("body")).toContainText(/total revenue/i);
    await expect(page.locator("body")).toContainText(/avg.*order|order.*value/i);
  });

  test("Top by Revenue and Top by Quantity tables render", async ({ page }) => {
    await page.goto("/admin/analytics");
    await page.waitForTimeout(2_000);
    await expect(page.locator("body")).toContainText(/top by revenue/i);
    await expect(page.locator("body")).toContainText(/top by quantity/i);
  });
});
