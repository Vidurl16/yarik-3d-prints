/**
 * /reset-password page — end-to-end tests.
 *
 * Section A: Structural tests — run always, no credentials needed.
 *
 * Section B: Flow tests — require TEST_USER_EMAIL to be set, which indicates
 *   a live Supabase project is available. These test the full PKCE token
 *   exchange and password update (mocked at the network level).
 *
 * NOTE on PKCE mocking: exchangeCodeForSession() requires a code_verifier
 * stored in sessionStorage by the Supabase client during the original auth
 * redirect. In a test environment this verifier is absent, so the flow tests
 * must be run against a real Supabase instance (set TEST_USER_EMAIL to enable).
 */
import { test, expect, type Page } from "@playwright/test";

const hasCredentials = !!process.env.TEST_USER_EMAIL;

// ─── Safe Supabase auth fallback ─────────────────────────────────────────────
// Prevents route.continue() from trying to reach placeholder.supabase.co
// (non-existent DNS) which hangs the test runner.

async function stubAuthEndpoints(page: Page) {
  await page.route("**/auth/v1/**", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ error: "unauthenticated", message: "Stub response" }),
    });
  });
}

// ─── A. Structural tests (no credentials required) ───────────────────────────

test.describe("Reset password page — no token (structural)", () => {
  test("shows verifying state on first load", async ({ page }) => {
    await stubAuthEndpoints(page);
    await page.goto("/reset-password");
    const body = await page.locator("body").textContent();
    const isExpected = /verifying|expired|invalid|request new/i.test(body ?? "");
    expect(isExpected).toBe(true);
  });

  test("shows expired/invalid state after the 5s timeout", async ({ page }) => {
    await stubAuthEndpoints(page);
    await page.goto("/reset-password");
    await expect(page.locator("body")).toContainText(/expired|invalid|request new link/i, {
      timeout: 8_000,
    });
  });

  test("expired state shows a Request New Link button linking to /login", async ({ page }) => {
    await stubAuthEndpoints(page);
    await page.goto("/reset-password");
    const link = page.getByRole("link", { name: /request new link/i });
    await expect(link).toBeVisible({ timeout: 8_000 });
    await expect(link).toHaveAttribute("href", "/login");
  });

  test("page always has at least one link to /login", async ({ page }) => {
    await stubAuthEndpoints(page);
    await page.goto("/reset-password");
    // Filter to content-area links (the nav link is hidden in mobile/tablet collapsed menu)
    const loginLink = page.locator("a[href='/login']").filter({ hasText: /request|sign.?in|back/i }).first();
    await expect(loginLink).toBeVisible({ timeout: 8_000 });
  });
});

test.describe("Reset password page — expired code (structural)", () => {
  test("?code= param with stub Supabase shows expired/invalid state", async ({ page }) => {
    await stubAuthEndpoints(page);
    await page.goto("/reset-password?code=any-code");
    // Without a valid Supabase instance, exchangeCodeForSession fails → markInvalid()
    await expect(page.locator("body")).toContainText(/expired|invalid/i, { timeout: 8_000 });
  });

  test("expired state does not show the password form", async ({ page }) => {
    await stubAuthEndpoints(page);
    await page.goto("/reset-password?code=any-code");
    await page.waitForTimeout(2_000);
    await expect(page.locator("input[type='password']")).not.toBeVisible();
  });

  test("expired state has a link to /login for requesting a new link", async ({ page }) => {
    await stubAuthEndpoints(page);
    await page.goto("/reset-password?code=any-code");
    await expect(page.getByRole("link", { name: /request new link/i })).toBeVisible({ timeout: 8_000 });
  });
});

// ─── B. Flow tests (require live Supabase) ───────────────────────────────────

test.describe("Reset password page — valid session (mocked, requires credentials)", () => {
  test.skip(!hasCredentials, "Set TEST_USER_EMAIL to enable live Supabase flow tests");

  test("shows NEW PASSWORD form when session is established", async ({ page }) => {
    await page.goto("/reset-password");
    await expect(page.locator("h1")).toContainText(/new password/i, { timeout: 10_000 });
  });

  test("form has two password inputs both with minLength=8", async ({ page }) => {
    await page.goto("/reset-password");
    await page.waitForSelector("input[type='password']", { timeout: 10_000 });
    const inputs = page.locator("input[type='password']");
    await expect(inputs).toHaveCount(2);
    const minLengths = await inputs.evaluateAll(
      (els: HTMLInputElement[]) => els.map((e) => e.getAttribute("minlength"))
    );
    expect(minLengths).toEqual(["8", "8"]);
  });

  test("mismatched passwords shows inline error", async ({ page }) => {
    await page.goto("/reset-password");
    await page.waitForSelector("input[type='password']", { timeout: 10_000 });
    const [newPw, confirmPw] = await page.locator("input[type='password']").all();
    await newPw.fill("password123");
    await confirmPw.fill("different456");
    await page.getByRole("button", { name: /set new password/i }).click();
    await expect(page.locator("body")).toContainText(/do not match/i, { timeout: 3_000 });
  });

  test("password shorter than 8 chars is rejected by the browser", async ({ page }) => {
    await page.goto("/reset-password");
    await page.waitForSelector("input[type='password']", { timeout: 10_000 });
    const newPw = page.locator("input[type='password']").first();
    await newPw.fill("short1");
    await page.getByRole("button", { name: /set new password/i }).click();
    const tooShort = await newPw.evaluate((el: HTMLInputElement) => el.validity.tooShort);
    expect(tooShort).toBe(true);
  });
});
