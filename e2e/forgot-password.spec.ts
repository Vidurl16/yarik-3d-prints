/**
 * Forgotten password flow — UI behaviour and API integration.
 * The /api/auth/reset-password route is intercepted so no real
 * email is sent and no Supabase credentials are required.
 */
import { test, expect, type Page } from "@playwright/test";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function mockResetSuccess(page: Page) {
  await page.route("/api/auth/reset-password", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    })
  );
}

async function mockResetFailure(page: Page) {
  await page.route("/api/auth/reset-password", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "Failed to send reset email. Please try again." }),
    })
  );
}

async function openForgotMode(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: /forgot password/i }).click();
}

// ─── Rendering ────────────────────────────────────────────────────────────────

test.describe("Forgot password — rendering", () => {
  test("login page has a Forgot password? button", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /forgot password/i })).toBeVisible();
  });

  test("clicking Forgot password? shows RESET PASSWORD heading", async ({ page }) => {
    await openForgotMode(page);
    await expect(page.locator("h1")).toContainText(/reset password/i);
  });

  test("forgot mode shows only an email input — no password field", async ({ page }) => {
    await openForgotMode(page);
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).not.toBeVisible();
  });

  test("forgot mode shows a Send Reset Link submit button", async ({ page }) => {
    await openForgotMode(page);
    await expect(page.getByRole("button", { name: /send reset link/i })).toBeVisible();
  });

  test("forgot mode shows a Back to sign in button", async ({ page }) => {
    await openForgotMode(page);
    await expect(page.getByRole("button", { name: /back to sign in/i })).toBeVisible();
  });

  test("forgot mode does not show the signup toggle", async ({ page }) => {
    await openForgotMode(page);
    // The signup/login toggle text should not be visible in forgot mode
    const toggle = page.getByRole("button", { name: /don.t have an account/i });
    await expect(toggle).not.toBeVisible();
  });
});

// ─── Navigation ───────────────────────────────────────────────────────────────

test.describe("Forgot password — navigation", () => {
  test("Back to sign in returns to SIGN IN heading", async ({ page }) => {
    await openForgotMode(page);
    await page.getByRole("button", { name: /back to sign in/i }).click();
    await expect(page.locator("h1")).toContainText(/sign in/i);
  });

  test("Back to sign in restores the password input", async ({ page }) => {
    await openForgotMode(page);
    await page.getByRole("button", { name: /back to sign in/i }).click();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  test("Back to sign in restores the Forgot password? button", async ({ page }) => {
    await openForgotMode(page);
    await page.getByRole("button", { name: /back to sign in/i }).click();
    await expect(page.getByRole("button", { name: /forgot password/i })).toBeVisible();
  });
});

// ─── Success flow ─────────────────────────────────────────────────────────────

test.describe("Forgot password — success (mocked API)", () => {
  test("submitting sends POST to /api/auth/reset-password with the email", async ({ page }) => {
    let capturedBody: Record<string, string> | null = null;
    await page.route("/api/auth/reset-password", async (route) => {
      capturedBody = await route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await openForgotMode(page);
    await page.locator("input[type='email']").fill("test@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();
    await page.waitForTimeout(1_000);

    expect(capturedBody).not.toBeNull();
    expect(capturedBody!.email).toBe("test@example.com");
  });

  test("success shows 'Check your inbox!' confirmation", async ({ page }) => {
    await mockResetSuccess(page);
    await openForgotMode(page);
    await page.locator("input[type='email']").fill("test@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();
    await expect(page.locator("body")).toContainText(/check your inbox/i, { timeout: 5_000 });
  });

  test("success shows the submitted email address in confirmation", async ({ page }) => {
    await mockResetSuccess(page);
    await openForgotMode(page);
    await page.locator("input[type='email']").fill("myemail@test.com");
    await page.getByRole("button", { name: /send reset link/i }).click();
    await expect(page.locator("body")).toContainText("myemail@test.com", { timeout: 5_000 });
  });

  test("success hides the submit button", async ({ page }) => {
    await mockResetSuccess(page);
    await openForgotMode(page);
    await page.locator("input[type='email']").fill("test@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();
    await expect(page.getByRole("button", { name: /send reset link/i })).not.toBeVisible({
      timeout: 5_000,
    });
  });
});

// ─── Error flow ───────────────────────────────────────────────────────────────

test.describe("Forgot password — error (mocked API)", () => {
  test("API error shows an inline error message", async ({ page }) => {
    await mockResetFailure(page);
    await openForgotMode(page);
    await page.locator("input[type='email']").fill("test@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();
    await expect(page.locator("body")).toContainText(/could not send|failed|try again/i, {
      timeout: 5_000,
    });
  });

  test("error keeps the submit button visible so user can retry", async ({ page }) => {
    await mockResetFailure(page);
    await openForgotMode(page);
    await page.locator("input[type='email']").fill("test@example.com");
    await page.getByRole("button", { name: /send reset link/i }).click();
    await page.waitForTimeout(2_000);
    await expect(page.getByRole("button", { name: /send reset link/i })).toBeVisible();
  });
});

// ─── Client-side validation ───────────────────────────────────────────────────

test.describe("Forgot password — client validation", () => {
  test("submitting with empty email triggers browser validation", async ({ page }) => {
    await openForgotMode(page);
    await page.getByRole("button", { name: /send reset link/i }).click();
    const emailInput = page.locator("input[type='email']");
    const missing = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(missing).toBe(true);
  });

  test("submitting with invalid email format triggers browser validation", async ({ page }) => {
    await openForgotMode(page);
    await page.locator("input[type='email']").fill("not-an-email");
    await page.getByRole("button", { name: /send reset link/i }).click();
    const emailInput = page.locator("input[type='email']");
    const invalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(invalid).toBe(true);
  });
});

// ─── Password minimum — signup ─────────────────────────────────────────────

test.describe("Signup — password minimum (8 chars)", () => {
  test("password field has minLength of 8 on signup form", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /don.t have an account.*sign up/i }).click();
    const minLength = await page
      .locator("input[type='password']")
      .getAttribute("minlength");
    expect(minLength).toBe("8");
  });

  test("password shorter than 8 chars is rejected by browser on signup", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /don.t have an account.*sign up/i }).click();
    await page.locator("input[type='email']").fill("user@example.com");
    await page.locator("input[type='password']").fill("short1");
    await page.getByRole("button", { name: /create account/i }).click();
    const tooShort = await page
      .locator("input[type='password']")
      .evaluate((el: HTMLInputElement) => el.validity.tooShort);
    expect(tooShort).toBe(true);
  });
});

// ─── Update-password page ─────────────────────────────────────────────────────

test.describe("Update password page — rendering", () => {
  test("shows a verifying message or new password form", async ({ page }) => {
    await page.goto("/auth/update-password");
    // Either the loading state or the form should be visible
    const hasHeading = await page
      .locator("body")
      .evaluate((el) =>
        /verifying|new password/i.test(el.textContent ?? "")
      );
    expect(hasHeading).toBe(true);
  });

  test("links back to /login when link may have expired", async ({ page }) => {
    await page.goto("/auth/update-password");
    // The loading state includes a link to /login
    const loginLink = page.getByRole("link", { name: /request a new one/i });
    await expect(loginLink).toBeVisible({ timeout: 5_000 });
  });
});
