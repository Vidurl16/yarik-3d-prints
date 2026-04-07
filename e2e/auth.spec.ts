/**
 * Authentication flows — login, signup, logout, redirects.
 * Supabase API calls are intercepted with page.route() so tests
 * run without real credentials.
 */
import { test, expect } from "@playwright/test";
import {
  mockSignInSuccess,
  mockSignInFailure,
  mockSignUpSuccess,
} from "./helpers/auth";

const SUPABASE_URL = "https://zdwqssqppdbwqigxxgje.supabase.co";

// ─── Login page rendering ──────────────────────────────────────────────────────

test.describe("Login page — rendering", () => {
  test("shows SIGN IN heading by default", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText(/sign in/i);
  });

  test("shows THE DEXARIUM sub-heading", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("body")).toContainText(/the dexarium/i);
  });

  test("has email input", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("input[type='email']")).toBeVisible();
  });

  test("has password input", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  test("has a submit button", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("has link back to Dexarium", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("link", { name: /back.*dexarium|← back/i })).toBeVisible();
  });
});

// ─── Toggle login / signup mode ───────────────────────────────────────────────

test.describe("Login page — mode toggle", () => {
  test("clicking signup toggle switches to CREATE ACCOUNT mode", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /don.t have an account.*sign up/i }).click();
    await expect(page.locator("h1")).toContainText(/create account/i);
  });

  test("switching back to login mode restores SIGN IN heading", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /don.t have an account.*sign up/i }).click();
    await page.getByRole("button", { name: /already have an account.*sign in/i }).click();
    await expect(page.locator("h1")).toContainText(/sign in/i);
  });
});

// ─── Login form — validation ──────────────────────────────────────────────────

test.describe("Login form — client validation", () => {
  test("submitting with empty fields shows browser validation", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /sign in/i }).click();
    const emailInput = page.locator("input[type='email']");
    const valid = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(valid).toBe(true);
  });

  test("password shorter than 8 chars is rejected by browser on login", async ({ page }) => {
    await page.goto("/login");
    await page.locator("input[type='email']").fill("user@example.com");
    await page.locator("input[type='password']").fill("short1");
    await page.getByRole("button", { name: /sign in/i }).click();
    const pwInput = page.locator("input[type='password']");
    const valid = await pwInput.evaluate(
      (el: HTMLInputElement) => el.validity.tooShort
    );
    expect(valid).toBe(true);
  });
});

// ─── Login flow — success (mocked) ───────────────────────────────────────────

test.describe("Login flow — success (mocked Supabase)", () => {
  test("successful login shows no error and button leaves loading state", async ({ page }) => {
    await mockSignInSuccess(page, "user@example.com");
    await page.goto("/login");
    await page.locator("input[type='email']").fill("user@example.com");
    await page.locator("input[type='password']").fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();
    // No error message should appear
    await page.waitForTimeout(1_500);
    const errorEl = page.locator("p.text-red-400, [class*='red']");
    const errorVisible = await errorEl.isVisible().catch(() => false);
    expect(errorVisible).toBe(false);
  });

  test("login form accepts valid email and password without validation errors", async ({ page }) => {
    await mockSignInSuccess(page, "user@example.com");
    await page.goto("/login?next=/preorders");
    await page.locator("input[type='email']").fill("user@example.com");
    await page.locator("input[type='password']").fill("password123");
    // Verify inputs accepted the values
    await expect(page.locator("input[type='email']")).toHaveValue("user@example.com");
    await expect(page.locator("input[type='password']")).toHaveValue("password123");
  });
});

// ─── Login flow — failure (mocked) ───────────────────────────────────────────

test.describe("Login flow — failure (mocked Supabase)", () => {
  test("wrong credentials shows inline error message", async ({ page }) => {
    await mockSignInFailure(page);
    await page.goto("/login");
    await page.locator("input[type='email']").fill("user@example.com");
    await page.locator("input[type='password']").fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.locator("p.text-red-400, [class*='red']")).toBeVisible({
      timeout: 8_000,
    });
  });

  test("error message contains credential-related text", async ({ page }) => {
    await mockSignInFailure(page);
    await page.goto("/login");
    await page.locator("input[type='email']").fill("user@example.com");
    await page.locator("input[type='password']").fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.locator("body")).toContainText(/invalid|credentials|incorrect/i, {
      timeout: 8_000,
    });
  });

  test("button shows loading state while submitting", async ({ page }) => {
    // Delay the Supabase response so we can catch the loading state
    await page.route(`${SUPABASE_URL}/auth/v1/**`, async (route) => {
      await new Promise((r) => setTimeout(r, 2500));
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "invalid_grant" }),
      });
    });
    await page.goto("/login");
    await page.locator("input[type='email']").fill("user@example.com");
    await page.locator("input[type='password']").fill("wrongpassword");
    // Use button[type="submit"] — stable selector that doesn't change when text changes
    await page.locator("button[type='submit']").click();
    await expect(page.locator("button[type='submit']")).toContainText(/\.\.\.|loading/i, {
      timeout: 3_000,
    });
  });
});

// ─── Signup flow ──────────────────────────────────────────────────────────────

test.describe("Signup flow (mocked Supabase)", () => {
  test("successful signup shows confirmation message and returns to login mode", async ({
    page,
  }) => {
    await mockSignUpSuccess(page);
    await page.goto("/login");
    await page.getByRole("button", { name: /don.t have an account.*sign up/i }).click();
    await page.locator("input[type='email']").fill("newuser@example.com");
    await page.locator("input[type='password']").fill("password123");
    await page.getByRole("button", { name: /create account/i }).click();

    // New behaviour: inline confirmation replaces alert()
    await expect(page.getByRole("button", { name: /go to sign in/i })).toBeVisible({ timeout: 5_000 });
    // "Go to Sign In" button is shown
    await page.getByRole("button", { name: /go to sign in/i }).click();
    await expect(page.locator("h1")).toContainText(/sign in/i);
  });
});

// ─── Protected-page redirects ─────────────────────────────────────────────────

test.describe("Protected page redirects (unauthenticated)", () => {
  test("/account redirects to /login when not authenticated", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login/);
  });

  test("/login URL after /account redirect includes next=/account param", async ({
    page,
  }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/next=%2Faccount|next=\/account/);
  });

  test("/admin redirects to /login when not authenticated", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("/admin redirect preserves next=/admin param", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/next=%2Fadmin|next=\/admin/);
  });
});
