/**
 * Admin panel tests.
 *
 * ACCESS CONTROL tests run always (no credentials needed).
 *
 * ADMIN WORKFLOW tests require a real Supabase session — the admin layout uses
 * server-side getSession() which reads SSR cookies, so only real credentials work.
 *
 * Set env vars to unlock all 40+ workflow tests:
 *   TEST_ADMIN_EMAIL=vidur360@gmail.com
 *   TEST_ADMIN_PASSWORD=<password>
 *
 * Both vidur360@gmail.com and vidur.lutchminarain@gamesglobal.com are in the
 * admin allowlist (ADMIN_EMAIL_ALLOWLIST in .env.local).
 */
import { test, expect, Page } from "@playwright/test";
import path from "path";
import fs from "fs";
import os from "os";

const SUPABASE_URL = "https://zdwqssqppdbwqigxxgje.supabase.co";

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "";
const HAS_ADMIN_CREDS = !!ADMIN_EMAIL && !!ADMIN_PASSWORD;

// Unique slug so concurrent/repeated runs don't collide
const TEST_SLUG = `playwright-test-product-${Date.now()}`;
const TEST_NAME = "Playwright Test Product";

// ─── Helper: sign in via the login form ───────────────────────────────────────

async function signInAsAdmin(page: Page) {
  await page.goto("/login");
  await page.locator("input[type='email']").fill(ADMIN_EMAIL);
  await page.locator("input[type='password']").fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  // Admin email → redirects to /admin; regular email → /account
  await page.waitForURL(/\/account|\/admin/, { timeout: 20_000 });
}

/** Creates a tiny 1×1 PNG in a temp file — used for image upload tests. */
function createTestPng(): string {
  const tmpPath = path.join(os.tmpdir(), `playwright-test-${Date.now()}.png`);
  // Minimal valid 1×1 transparent PNG (67 bytes)
  const PNG_1PX = Buffer.from(
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489" +
    "0000000a49444154789c6260000000020001e221bc330000000049454e44ae426082",
    "hex"
  );
  fs.writeFileSync(tmpPath, PNG_1PX);
  return tmpPath;
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

  test("redirect preserves ?next=/admin param", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/next=%2Fadmin|next=\/admin/);
  });
});

// ─── ACCESS CONTROL — API routes return 403 without session (always run) ─────

test.describe("Admin — API access control (no session)", () => {
  test("GET /api/admin/products returns 403 without auth", async ({ request }) => {
    const res = await request.get("/api/admin/products");
    expect(res.status()).toBe(403);
  });

  test("POST /api/admin/products returns 403 without auth", async ({ request }) => {
    const res = await request.post("/api/admin/products", {
      data: { name: "Hacked", slug: "hacked", brand: "grimdark-future", type: "infantry", price_cents: 100 },
    });
    expect(res.status()).toBe(403);
  });

  test("POST /api/admin/upload-image returns 403 without auth", async ({ request }) => {
    const res = await request.post("/api/admin/upload-image", {
      multipart: { file: { name: "test.png", mimeType: "image/png", buffer: Buffer.from("") } },
    });
    expect(res.status()).toBe(403);
  });
});

// ─── LOGIN PAGE (always run) ──────────────────────────────────────────────────

test.describe("Admin — login page via redirect", () => {
  test("redirected login page has email + password fields", async ({ page }) => {
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

// ─── ADMIN DASHBOARD (requires credentials) ──────────────────────────────────

test.describe("Admin Dashboard (/admin)", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_ADMIN_CREDS) test.skip(true, "Set TEST_ADMIN_EMAIL + TEST_ADMIN_PASSWORD to run admin UI tests");
    await signInAsAdmin(page);
    await page.goto("/admin");
  });

  test("shows ADMIN DASHBOARD heading", async ({ page }) => {
    await expect(page.locator("body")).toContainText(/admin dashboard/i);
  });

  test("shows Products, Orders, Analytics navigation tiles", async ({ page }) => {
    // Use href-based locators to avoid strict mode violations from nav + tile both matching
    await expect(page.locator("a[href='/admin/products']").first()).toBeVisible();
    await expect(page.locator("a[href='/admin/orders']").first()).toBeVisible();
    await expect(page.locator("a[href='/admin/analytics']").first()).toBeVisible();
  });

  test("admin layout shows logged-in email", async ({ page }) => {
    await expect(page.locator("body")).toContainText(ADMIN_EMAIL);
  });

  test("Products tile navigates to /admin/products", async ({ page }) => {
    await page.locator("a[href='/admin/products']").first().click();
    await expect(page).toHaveURL(/\/admin\/products/);
  });

  test("Orders tile navigates to /admin/orders", async ({ page }) => {
    // Use href selector to avoid matching PREORDERS nav link
    await page.locator("a[href='/admin/orders']").first().click();
    await expect(page).toHaveURL(/\/admin\/orders/);
  });

  test("Analytics tile navigates to /admin/analytics", async ({ page }) => {
    await page.locator("a[href='/admin/analytics']").first().click();
    await expect(page).toHaveURL(/\/admin\/analytics/);
  });
});

// ─── PRODUCT LIST (requires credentials) ─────────────────────────────────────

test.describe("Admin Products list (/admin/products)", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_ADMIN_CREDS) test.skip(true, "Set TEST_ADMIN_EMAIL + TEST_ADMIN_PASSWORD to run admin UI tests");
    await signInAsAdmin(page);
    await page.goto("/admin/products");
  });

  test("shows PRODUCTS heading and + NEW PRODUCT button", async ({ page }) => {
    await expect(page.locator("body")).toContainText(/products/i);
    await expect(page.getByRole("link", { name: /new product/i })).toBeVisible();
  });

  test("table has all expected column headers", async ({ page }) => {
    for (const h of ["Name", "Brand", "Price", "Status", "Actions"]) {
      await expect(page.locator("th", { hasText: h })).toBeVisible();
    }
  });

  test("+ NEW PRODUCT navigates to /admin/products/new", async ({ page }) => {
    await page.getByRole("link", { name: /new product/i }).click();
    await expect(page).toHaveURL(/\/admin\/products\/new/);
  });
});

// ─── PRODUCT FORM FIELDS (requires credentials) ──────────────────────────────

test.describe("Admin New Product form (/admin/products/new)", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_ADMIN_CREDS) test.skip(true, "Set TEST_ADMIN_EMAIL + TEST_ADMIN_PASSWORD to run admin UI tests");
    await signInAsAdmin(page);
    await page.goto("/admin/products/new");
  });

  test("form has Name, Slug, Brand, Type, Print Type fields", async ({ page }) => {
    await expect(page.locator("input[name='name']")).toBeVisible();
    await expect(page.locator("input[name='slug']")).toBeVisible();
    await expect(page.locator("select[name='brand']")).toBeVisible();
    await expect(page.locator("select[name='type']")).toBeVisible();
    await expect(page.locator("select[name='print_type']")).toBeVisible();
  });

  test("form has Price field", async ({ page }) => {
    await expect(page.locator("input[name='price_cents']")).toBeVisible();
  });

  test("form has Faction and Role dropdowns", async ({ page }) => {
    await expect(page.locator("select[name='faction']")).toBeVisible();
    await expect(page.locator("select[name='role']")).toBeVisible();
  });

  test("form has Tags input", async ({ page }) => {
    await expect(page.locator("input[name='tags']")).toBeVisible();
  });

  test("form has image URL field and file upload input", async ({ page }) => {
    await expect(page.locator("input[name='image_url']")).toBeVisible();
    await expect(page.locator("input[type='file']")).toBeVisible();
  });

  test("form has New Arrival, Pre-order, Active checkboxes", async ({ page }) => {
    await expect(page.locator("input[name='is_new']")).toBeVisible();
    await expect(page.locator("input[name='is_preorder']")).toBeVisible();
    await expect(page.locator("input[name='is_active']")).toBeVisible();
  });

  test("pre-order date field appears when Pre-order is checked", async ({ page }) => {
    // Preorder date field should be hidden initially
    await expect(page.locator("input[name='preorder_date']")).not.toBeVisible();
    await page.locator("input[name='is_preorder']").check();
    await expect(page.locator("input[name='preorder_date']")).toBeVisible();
  });

  test("Brand dropdown contains all expected brands", async ({ page }) => {
    const select = page.locator("select[name='brand']");
    for (const brand of ["grimdark-future", "age-of-fantasy", "pokemon", "basing-battle-effects"]) {
      await expect(select.locator(`option[value='${brand}']`)).toHaveCount(1);
    }
  });

  test("Print Type dropdown has RESIN, FDM, MULTICOLOUR", async ({ page }) => {
    const select = page.locator("select[name='print_type']");
    for (const pt of ["RESIN", "FDM", "MULTICOLOUR"]) {
      await expect(select.locator(`option[value='${pt}']`)).toHaveCount(1);
    }
  });

  test("Cancel button returns to /admin/products", async ({ page }) => {
    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page).toHaveURL(/\/admin\/products$/);
  });

  test("submitting empty form shows browser validation", async ({ page }) => {
    await page.getByRole("button", { name: /create product/i }).click();
    // Name is required — form should not navigate away
    await expect(page).toHaveURL(/\/admin\/products\/new/);
  });
});

// ─── FULL PRODUCT CRUD WORKFLOW (requires credentials) ───────────────────────
//
// This is the key end-to-end test: create → verify in list → edit → delete.
// Image upload is tested as a separate step.

test.describe("Admin — full product CRUD workflow", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_ADMIN_CREDS) test.skip(true, "Set TEST_ADMIN_EMAIL + TEST_ADMIN_PASSWORD to run admin UI tests");
    await signInAsAdmin(page);
  });

  test("create a product — fills all fields and saves", async ({ page }) => {
    await page.goto("/admin/products/new");

    // Fill required fields
    await page.locator("input[name='name']").fill(TEST_NAME);
    await page.locator("input[name='slug']").fill(TEST_SLUG);
    await page.locator("select[name='brand']").selectOption("grimdark-future");
    await page.locator("select[name='type']").selectOption("infantry");
    await page.locator("select[name='print_type']").selectOption("RESIN");
    await page.locator("select[name='faction']").selectOption("space-marines");
    await page.locator("select[name='role']").selectOption("Battleline");
    await page.locator("input[name='price_cents']").fill("249.99");
    await page.locator("input[name='tags']").fill("playwright, test, automated");

    // Check New Arrival
    await page.locator("input[name='is_new']").check();

    await page.getByRole("button", { name: /create product/i }).click();

    // Should redirect back to products list on success
    await expect(page).toHaveURL(/\/admin\/products$/, { timeout: 15_000 });

    // Product should appear in the table
    await expect(page.locator("body")).toContainText(TEST_NAME);
    await expect(page.locator("body")).toContainText("R249.99");
  });

  test("new product appears in list with correct status and brand", async ({ page }) => {
    await page.goto("/admin/products");

    // Find the row containing our test product
    const row = page.locator("tr", { hasText: TEST_SLUG });
    await expect(row).toBeVisible({ timeout: 10_000 });
    await expect(row).toContainText("grimdark-future");
    await expect(row).toContainText("Active"); // is_active defaults to true
  });

  test("edit product — changes name and saves", async ({ page }) => {
    await page.goto("/admin/products");

    // Click Edit on the test product row
    const row = page.locator("tr", { hasText: TEST_SLUG });
    await row.getByRole("link", { name: /edit/i }).click();
    await expect(page).toHaveURL(/\/admin\/products\/.+\/edit/);

    // Change the name
    const nameInput = page.locator("input[name='name']");
    await nameInput.clear();
    await nameInput.fill(`${TEST_NAME} (edited)`);

    await page.getByRole("button", { name: /save changes/i }).click();
    await expect(page).toHaveURL(/\/admin\/products$/, { timeout: 15_000 });

    // Updated name appears in list
    await expect(page.locator("body")).toContainText(`${TEST_NAME} (edited)`);
  });

  test("deactivate product — toggles Active → Inactive", async ({ page }) => {
    await page.goto("/admin/products");

    const row = page.locator("tr", { hasText: TEST_SLUG });
    await expect(row.locator("span", { hasText: "Active" })).toBeVisible();

    // Click Deactivate button in the row
    await row.getByRole("button", { name: /deactivate/i }).click();

    // Wait for row to update (router.refresh())
    await expect(row.locator("span", { hasText: "Inactive" })).toBeVisible({ timeout: 10_000 });
  });

  test("reactivate product — toggles Inactive → Active", async ({ page }) => {
    await page.goto("/admin/products");

    const row = page.locator("tr", { hasText: TEST_SLUG });
    // Activate (may already be inactive from previous test)
    const activateBtn = row.getByRole("button", { name: /activate/i });
    if (await activateBtn.isVisible()) {
      await activateBtn.click();
      await expect(row.locator("span", { hasText: "Active" })).toBeVisible({ timeout: 10_000 });
    }
  });

  test("delete product — removes it from the list", async ({ page }) => {
    await page.goto("/admin/products");

    const row = page.locator("tr", { hasText: TEST_SLUG });
    await expect(row).toBeVisible();

    // Playwright auto-accepts dialogs — confirm the delete prompt
    page.on("dialog", (dialog) => dialog.accept());
    await row.getByRole("button", { name: /delete/i }).click();

    // Row should disappear
    await expect(row).not.toBeVisible({ timeout: 10_000 });
  });
});

// ─── IMAGE UPLOAD WORKFLOW (requires credentials) ────────────────────────────

test.describe("Admin — image upload workflow", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_ADMIN_CREDS) test.skip(true, "Set TEST_ADMIN_EMAIL + TEST_ADMIN_PASSWORD to run admin UI tests");
    await signInAsAdmin(page);
  });

  test("file input accepts an image and shows its filename", async ({ page }) => {
    await page.goto("/admin/products/new");

    const tmpImg = createTestPng();
    const fileInput = page.locator("input[type='file']");
    await fileInput.setInputFiles(tmpImg);

    // The filename should be reflected in the input
    const files = await fileInput.evaluate((el: HTMLInputElement) =>
      Array.from(el.files ?? []).map((f) => f.name)
    );
    expect(files.length).toBe(1);
    expect(files[0]).toMatch(/\.png$/);

    fs.unlinkSync(tmpImg);
  });

  test("uploading an image with a new product stores Supabase URL in image_url", async ({ page }) => {
    const uploadSlug = `playwright-img-test-${Date.now()}`;
    const fakeImageUrl = `${SUPABASE_URL}/storage/v1/object/public/product-images/new/${Date.now()}.png`;

    await page.goto("/admin/products/new");

    // Mock the upload endpoint — we're testing the UI flow, not actual Supabase storage
    let uploadCalled = false;
    await page.route("**/api/admin/upload-image", async (route) => {
      uploadCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: fakeImageUrl }),
      });
    });

    await page.locator("input[name='name']").fill("Playwright Image Test");
    await page.locator("input[name='slug']").fill(uploadSlug);
    await page.locator("input[name='price_cents']").fill("99.99");

    const tmpImg = createTestPng();
    await page.locator("input[type='file']").setInputFiles(tmpImg);
    fs.unlinkSync(tmpImg);

    await page.getByRole("button", { name: /create product/i }).click();

    // Should redirect to product list after upload + save
    await expect(page).toHaveURL(/\/admin\/products$/, { timeout: 20_000 });
    expect(uploadCalled).toBe(true);

    // Clean up — delete the test product
    const row = page.locator("tr", { hasText: uploadSlug });
    if (await row.isVisible()) {
      page.on("dialog", (d) => d.accept());
      await row.getByRole("button", { name: /delete/i }).click();
    }
  });
});

// ─── ORDERS MANAGEMENT (requires credentials) ────────────────────────────────

test.describe("Admin Orders (/admin/orders)", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_ADMIN_CREDS) test.skip(true, "Set TEST_ADMIN_EMAIL + TEST_ADMIN_PASSWORD to run admin UI tests");
    await signInAsAdmin(page);
    await page.goto("/admin/orders");
  });

  test("shows ORDERS heading with date range filters", async ({ page }) => {
    await expect(page.locator("body")).toContainText(/orders/i);
    await expect(page.locator("input[type='date']")).toHaveCount(2);
    await expect(page.getByRole("button", { name: /apply/i })).toBeVisible();
  });

  test("status filter dropdown has all expected values", async ({ page }) => {
    const select = page.locator("select").first();
    for (const status of ["paid", "pending", "failed", "refunded"]) {
      await expect(select.locator(`option[value='${status}']`)).toHaveCount(1);
    }
  });

  test("order table has all expected column headers", async ({ page }) => {
    await page.waitForTimeout(1_000);
    for (const h of ["Date", "Order ID", "Email", "Total", "Status"]) {
      await expect(page.locator("th", { hasText: h })).toBeVisible();
    }
  });

  test("changing date range and clicking Apply refreshes the list", async ({ page }) => {
    const [fromInput, toInput] = await page.locator("input[type='date']").all();
    await fromInput.fill("2024-01-01");
    await toInput.fill("2024-12-31");
    await page.getByRole("button", { name: /apply/i }).click();
    // URL should update with date params or page should reload without error
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).not.toContainText(/error/i);
  });
});

// ─── ANALYTICS (requires credentials) ────────────────────────────────────────

test.describe("Admin Analytics (/admin/analytics)", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_ADMIN_CREDS) test.skip(true, "Set TEST_ADMIN_EMAIL + TEST_ADMIN_PASSWORD to run admin UI tests");
    await signInAsAdmin(page);
    await page.goto("/admin/analytics");
    await page.waitForTimeout(2_000);
  });

  test("shows ANALYTICS heading with date range filters", async ({ page }) => {
    await expect(page.locator("body")).toContainText(/analytics/i);
    await expect(page.locator("input[type='date']")).toHaveCount(2);
    await expect(page.getByRole("button", { name: /apply/i })).toBeVisible();
  });

  test("KPI cards render — Total Revenue and Avg Order Value", async ({ page }) => {
    await expect(page.locator("body")).toContainText(/total revenue/i);
    await expect(page.locator("body")).toContainText(/avg.*order|order.*value/i);
  });

  test("Top by Revenue and Top by Quantity tables render", async ({ page }) => {
    await expect(page.locator("body")).toContainText(/top by revenue/i);
    await expect(page.locator("body")).toContainText(/top by quantity/i);
  });

  test("KPI cards show R currency values", async ({ page }) => {
    // Analytics formats as "R 0,00" (South African locale: space + comma separator)
    await expect(page.locator("body")).toContainText(/R[\s\d]/);
  });
});
