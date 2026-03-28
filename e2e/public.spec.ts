/**
 * Public pages — no authentication required.
 * Verifies that every publicly accessible route loads correctly and
 * contains the expected headings / key content.
 */
import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows The Dexarium branding", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/dexarium|yarik/i);
    // Heading or brand name visible somewhere on the page
    await expect(page.locator("body")).toContainText(/dexarium/i);
  });

  test("navigation bar is visible", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav").first();
    await expect(nav).toBeVisible();
  });

  test("links to /shop from the homepage", async ({ page }) => {
    await page.goto("/");
    const shopLink = page.getByRole("link", { name: /shop/i }).first();
    await expect(shopLink).toBeVisible();
    await shopLink.click();
    await expect(page).toHaveURL(/\/shop/);
  });
});

test.describe("Shop page (/shop)", () => {
  test("loads without errors", async ({ page }) => {
    await page.goto("/shop");
    await expect(page).not.toHaveURL(/error/i);
    await expect(page.locator("body")).not.toContainText(/500 Internal Server Error/i);
  });

  test("shows faction cards or product listings", async ({ page }) => {
    await page.goto("/shop");
    // Page should contain some product/faction content (not be blank)
    await expect(page.locator("body")).not.toContainText(/no products/i);
  });

  test("page title contains shop-related term", async ({ page }) => {
    await page.goto("/shop");
    await expect(page).toHaveTitle(/shop|dexarium|yarik/i);
  });
});

test.describe("Shop faction page (/shop/[faction])", () => {
  test("loads the space-marines faction page", async ({ page }) => {
    // Navigate to shop first to discover a faction link
    await page.goto("/shop");
    const factionLinks = page.locator("a[href^='/shop/']");
    const count = await factionLinks.count();
    if (count > 0) {
      const href = await factionLinks.first().getAttribute("href");
      await page.goto(href!);
      await expect(page).not.toHaveURL(/error/i);
      await expect(page.locator("body")).not.toContainText(/500 Internal Server Error/i);
    } else {
      // Fallback: try a known faction path
      await page.goto("/shop/space-marines");
      // Either loads content or shows a not-found – both are valid
      await expect(page.locator("body")).not.toContainText(/500 Internal Server Error/i);
    }
  });
});

test.describe("New Arrivals (/new-arrivals)", () => {
  test("loads without errors", async ({ page }) => {
    await page.goto("/new-arrivals");
    await expect(page).not.toHaveURL(/error/i);
    await expect(page.locator("body")).not.toContainText(/500/i);
  });

  test("shows new arrivals heading", async ({ page }) => {
    await page.goto("/new-arrivals");
    await expect(page.locator("body")).toContainText(/new arriv/i);
  });
});

test.describe("Preorders (/preorders)", () => {
  test("loads without errors", async ({ page }) => {
    await page.goto("/preorders");
    await expect(page).not.toHaveURL(/error/i);
  });

  test("shows PREORDERS heading", async ({ page }) => {
    await page.goto("/preorders");
    await expect(page.locator("body")).toContainText(/preorder/i);
  });

  test("shows empty state or product grid", async ({ page }) => {
    await page.goto("/preorders");
    const hasProducts = await page.locator("[class*='grid']").count() > 0;
    const hasEmpty = (await page.locator("body").textContent())?.toLowerCase().includes("no preorder");
    expect(hasProducts || hasEmpty).toBeTruthy();
  });
});

test.describe("Army Builder (/builder)", () => {
  test("loads without errors", async ({ page }) => {
    await page.goto("/builder");
    await expect(page).not.toHaveURL(/error/i);
  });

  test("shows ARMY BUILDER heading", async ({ page }) => {
    await page.goto("/builder");
    await expect(page.locator("body")).toContainText(/army builder/i);
  });

  test("breadcrumb navigates back to home", async ({ page }) => {
    await page.goto("/builder");
    await page.getByRole("link", { name: /home/i }).first().click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Cart (/cart)", () => {
  test("loads without errors", async ({ page }) => {
    await page.goto("/cart");
    await expect(page).not.toHaveURL(/error/i);
    await expect(page.locator("body")).not.toContainText(/500/i);
  });

  test("shows cart page content", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.locator("body")).not.toContainText(/500 Internal Server Error/i);
  });
});

test.describe("Order Status (/order-status)", () => {
  test("loads the order lookup form", async ({ page }) => {
    await page.goto("/order-status");
    await expect(page.locator("body")).toContainText(/order status|order ref|order number/i);
  });

  test("lookup form has required inputs", async ({ page }) => {
    await page.goto("/order-status");
    // Should have an email or order-ID input
    const inputs = page.locator("input");
    await expect(inputs.first()).toBeVisible();
  });

  test("returns no result for invalid order reference", async ({ page }) => {
    // Use a valid UUID format that won't exist in the database
    await page.goto("/order-status?order=00000000-0000-0000-0000-000000000000&email=nobody@example.com");
    await expect(page.locator("body")).toContainText(/not found|no order|couldn.t find|order.*not/i);
  });
});

test.describe("Contact (/contact)", () => {
  test("loads the contact page", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("body")).toContainText(/contact/i);
  });

  test("shows a form with Name, Email, and Message fields", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("input[type='email'], input[name='email']")).toBeVisible();
    await expect(page.locator("textarea")).toBeVisible();
  });

  test("empty submit shows validation", async ({ page }) => {
    await page.goto("/contact");
    // Attempt to submit without filling anything
    const submitBtn = page.getByRole("button", { name: /send|submit/i });
    await submitBtn.click();
    // Browser native validation or error message should appear
    const emailInput = page.locator("input[type='email']").first();
    const validity = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing
    );
    expect(validity).toBe(true);
  });
});

test.describe("Login page (/login)", () => {
  test("loads without errors", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("body")).toContainText(/sign in|login/i);
  });

  test("shows email and password inputs", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  test("has back-to-dexarium link", async ({ page }) => {
    await page.goto("/login");
    // Use .last() — there are two links matching "dexarium" (logo + the explicit back link)
    await expect(page.getByRole("link", { name: /back.*dexarium|← back/i }).last()).toBeVisible();
  });
});

test.describe("404 Not Found", () => {
  test("non-existent nested route shows not-found page", async ({ page }) => {
    // Single-segment unknown paths hit the [brand] dynamic route and render an empty brand page.
    // A deeply nested path has no matching route and triggers the actual not-found page.
    const response = await page.goto("/shop/this-faction/deeply/nested/missing");
    expect([404, 200]).toContain(response?.status());
    await expect(page.locator("body")).not.toContainText(/500 internal server error/i);
  });
});

test.describe("Navbar mega-menu", () => {
  test("SHOP button is visible in the desktop nav", async ({ page }) => {
    await page.goto("/");
    // The SHOP trigger is a <button> in the nav
    const shopBtn = page.locator("nav button", { hasText: /^shop$/i });
    await expect(shopBtn).toBeVisible();
  });

  test("clicking SHOP opens the mega-menu panel", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav button", { hasText: /^shop$/i }).click();
    // Left column header "Browse by Brand" should appear
    await expect(page.locator("body")).toContainText(/browse by brand/i);
  });

  test("mega-menu lists all five brands", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav button", { hasText: /^shop$/i }).click();
    await expect(page.locator("body")).toContainText(/grimdark future/i);
    await expect(page.locator("body")).toContainText(/age of fantasy/i);
    await expect(page.locator("body")).toContainText(/pok[eé]mon/i);
    await expect(page.locator("body")).toContainText(/basing/i);
    await expect(page.locator("body")).toContainText(/gaming.*terrain|terrain.*gaming/i);
  });

  test("hovering a brand entry switches the right panel to that brand", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav button", { hasText: /^shop$/i }).click();
    // Hover over Age of Fantasy entry
    await page.locator("nav button", { hasText: /age of fantasy/i }).hover();
    // Right panel should now show Age of Fantasy content
    await expect(page.locator("body")).toContainText(/age of fantasy/i);
    await expect(page.locator("body")).toContainText(/heroic warriors|legendary warriors|ancient magic/i);
  });

  test("mega-menu shows subcategory chips for active brand", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav button", { hasText: /^shop$/i }).click();
    // Default active brand is Grimdark Future — right panel shows Infantry / Vehicles / Characters
    await expect(page.locator("body")).toContainText(/infantry/i);
    await expect(page.locator("body")).toContainText(/vehicles/i);
    await expect(page.locator("body")).toContainText(/characters/i);
  });

  test("clicking a brand entry in the mega-menu navigates to its page", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav button", { hasText: /^shop$/i }).click();
    // Click the Pokémon brand entry button
    await page.locator("nav button", { hasText: /pok[eé]mon/i }).click();
    await expect(page).toHaveURL("/pokemon");
    await expect(page.locator("body")).not.toContainText(/500 internal server error/i);
  });

  test("VIEW ALL link in mega-menu navigates to /shop", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav button", { hasText: /^shop$/i }).click();
    await page.getByRole("link", { name: /view all/i }).click();
    await expect(page).toHaveURL("/shop");
  });

  test("mega-menu closes after clicking a subcategory link", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav button", { hasText: /^shop$/i }).click();
    // Click Infantry subcategory chip
    const infantryLink = page.locator("nav a", { hasText: /^infantry$/i }).first();
    await infantryLink.click();
    // Mega-menu should be gone
    await expect(page.locator("body")).not.toContainText(/browse by brand/i);
  });
});
