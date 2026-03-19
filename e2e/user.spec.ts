/**
 * User account tests.
 *
 * UNAUTHENTICATED redirect tests always run.
 * AUTHENTICATED account page tests require TEST_USER_EMAIL + TEST_USER_PASSWORD
 * because the account page is server-rendered via getSession().
 */
import { test, expect, Page } from "@playwright/test";

const USER_EMAIL = process.env.TEST_USER_EMAIL ?? "";
const USER_PASSWORD = process.env.TEST_USER_PASSWORD ?? "";
const HAS_USER_CREDS = !!USER_EMAIL && !!USER_PASSWORD;

async function signInAsUser(page: Page) {
  await page.goto("/login");
  await page.locator("input[type='email']").fill(USER_EMAIL);
  await page.locator("input[type='password']").fill(USER_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/account/, { timeout: 15_000 });
}

// ─── Always run: redirect when unauthenticated ────────────────────────────────

test.describe("Account — unauthenticated redirects", () => {
  test("/account redirects to /login when not logged in", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirect preserves ?next=/account in query string", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/next=%2Faccount|next=\/account/);
  });

  test("redirected login page shows email + password inputs", async ({ page }) => {
    await page.goto("/account");
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });
});

// ─── Always run: regular user cannot access admin panel ───────────────────────

test.describe("User — cannot access admin (no SSR session)", () => {
  test("unauthenticated visit to /admin redirects to /login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated visit to /admin/products redirects to /login", async ({ page }) => {
    await page.goto("/admin/products");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated visit to /admin/orders redirects to /login", async ({ page }) => {
    await page.goto("/admin/orders");
    await expect(page).toHaveURL(/\/login/);
  });
});

// ─── Authenticated account page (requires real credentials) ──────────────────

test.describe("Account page (/account) — authenticated", () => {
  test.beforeEach(async ({ page }) => {
    if (!HAS_USER_CREDS) test.skip(true, "Set TEST_USER_EMAIL + TEST_USER_PASSWORD to run account UI tests");
    await signInAsUser(page);
  });

  test("shows YOUR ACCOUNT heading", async ({ page }) => {
    await page.goto("/account");
    await expect(page.locator("h1")).toContainText(/your account/i);
  });

  test("shows logged-in user email", async ({ page }) => {
    await page.goto("/account");
    await expect(page.locator("body")).toContainText(USER_EMAIL);
  });

  test("shows Order History section", async ({ page }) => {
    await page.goto("/account");
    await expect(page.locator("body")).toContainText(/order history/i);
  });

  test("shows empty state or order rows", async ({ page }) => {
    await page.goto("/account");
    const body = await page.locator("body").textContent();
    const hasOrders = body?.includes("#") || body?.toLowerCase().includes("no orders");
    expect(hasOrders).toBeTruthy();
  });

  test("sign-out button is visible", async ({ page }) => {
    await page.goto("/account");
    await expect(
      page.getByRole("button", { name: /sign out|log out/i }).first()
    ).toBeVisible();
  });
});
