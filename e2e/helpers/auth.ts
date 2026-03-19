import { Page, Route } from "@playwright/test";

// ─── Supabase mock helpers ────────────────────────────────────────────────────

const SUPABASE_URL = "https://zdwqssqppdbwqigxxgje.supabase.co";

/** Intercept all Supabase auth requests with a custom handler. */
export function mockSupabaseAuth(
  page: Page,
  handler: (route: Route, request: Request) => Promise<void> | void
) {
  return page.route(`${SUPABASE_URL}/auth/v1/**`, (route, request) =>
    handler(route, request as unknown as Request)
  );
}

/** Mock a successful sign-in response. */
export async function mockSignInSuccess(page: Page, email = "user@example.com") {
  await mockSupabaseAuth(page, async (route) => {
    const url = route.request().url();
    if (url.includes("/token")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "fake-access-token",
          token_type: "bearer",
          expires_in: 3600,
          refresh_token: "fake-refresh-token",
          user: {
            id: "fake-user-id",
            email,
            role: "authenticated",
            email_confirmed_at: new Date().toISOString(),
          },
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/** Mock a failed sign-in (wrong password). */
export async function mockSignInFailure(page: Page) {
  await mockSupabaseAuth(page, async (route) => {
    const url = route.request().url();
    if (url.includes("/token")) {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "invalid_grant",
          error_description: "Invalid login credentials",
        }),
      });
    } else {
      await route.continue();
    }
  });
}

/** Mock sign-up success (email confirmation required). */
export async function mockSignUpSuccess(page: Page) {
  await mockSupabaseAuth(page, async (route) => {
    const url = route.request().url();
    if (url.includes("/signup")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "new-user-id",
          email: "newuser@example.com",
          confirmation_sent_at: new Date().toISOString(),
        }),
      });
    } else {
      await route.continue();
    }
  });
}
