/**
 * Cart tests — add, update quantity, remove, checkout navigation.
 * The cart is powered by Zustand (localStorage) and the cart drawer
 * is a client-side component, so we can exercise it fully in the browser.
 */
import { test, expect } from "@playwright/test";

// Helper: find the cart button by its aria-label (set in Nav.tsx)
function cartButton(page: import("@playwright/test").Page) {
  return page.locator("button[aria-label^='Open cart']");
}

// ─── Cart drawer ──────────────────────────────────────────────────────────────

test.describe("Cart drawer — empty state", () => {
  test("cart icon is visible in the nav", async ({ page }) => {
    await page.goto("/");
    await expect(cartButton(page)).toBeVisible();
  });

  test("opening the drawer shows empty state message", async ({ page }) => {
    await page.goto("/");
    await cartButton(page).click();
    await expect(page.locator("body")).toContainText(
      /your cart is empty|warband is empty|no items/i,
      { timeout: 5_000 }
    );
  });

  test("empty cart drawer has a shop link", async ({ page }) => {
    await page.goto("/");
    await cartButton(page).click();
    await page.waitForTimeout(500);
    // "BROWSE FACTIONS" or similar link inside the drawer
    const shopLink = page.locator("text=/browse|shop/i").last();
    await expect(shopLink).toBeVisible({ timeout: 5_000 });
  });

  test("closing the drawer via the X button works", async ({ page }) => {
    await page.goto("/");
    await cartButton(page).click();
    await page.waitForTimeout(500);
    // The close button is inside the drawer header (YOUR WARBAND heading)
    const drawerHeading = page.locator("h2", { hasText: /your warband/i });
    await expect(drawerHeading).toBeVisible({ timeout: 3_000 });
    // The X button is next to the heading
    const closeBtn = drawerHeading.locator("..").locator("button");
    await closeBtn.click();
    await page.waitForTimeout(500);
    await expect(drawerHeading).not.toBeVisible({ timeout: 3_000 });
  });
});

// ─── Cart page (/cart) ────────────────────────────────────────────────────────

test.describe("Cart page (/cart)", () => {
  test("loads without errors", async ({ page }) => {
    await page.goto("/cart");
    await expect(page).not.toHaveURL(/error/i);
    await expect(page.locator("body")).not.toContainText(/500/i);
  });

  test("shows empty cart state when no items added", async ({ page }) => {
    // Clear localStorage to ensure empty cart
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("cart-store"));
    await page.goto("/cart");
    await expect(page.locator("body")).toContainText(
      /empty|no items|warband/i
    );
  });

  test("has a link to continue shopping", async ({ page }) => {
    await page.goto("/cart");
    const link = page.getByRole("link", { name: /shop|browse|continue/i }).first();
    await expect(link).toBeVisible();
  });
});

// ─── Cart state manipulation via localStorage ─────────────────────────────────

test.describe("Cart — Zustand store manipulation", () => {
  // CartItem shape matches the store: price is ZAR (not cents), imageUrl not image_url
  const MOCK_ITEM = {
    id: "test-product-1",
    name: "Test Space Marine",
    price: 150,           // ZAR
    quantity: 1,
    imageUrl: "",
    printType: "RESIN",
  };

  async function injectCart(page: import("@playwright/test").Page, items: object[]) {
    await page.goto("/");
    // Zustand persist stores as { state: { items }, version: 0 } under key "yarik-cart"
    await page.evaluate((cartItems) => {
      localStorage.setItem("yarik-cart", JSON.stringify({ state: { items: cartItems }, version: 0 }));
    }, items);
    await page.reload();
  }

  test("adding a product to localStorage cart shows it in drawer", async ({ page }) => {
    await injectCart(page, [MOCK_ITEM]);
    await page.locator("button[aria-label^='Open cart']").click();
    await expect(page.locator("body")).toContainText(/Test Space Marine/i, { timeout: 5_000 });
  });

  test("cart shows correct price from store", async ({ page }) => {
    await injectCart(page, [MOCK_ITEM]);
    await page.locator("button[aria-label^='Open cart']").click();
    await expect(page.locator("body")).toContainText(/150|R\s*150/i, { timeout: 5_000 });
  });

  test("cart total updates when quantity is 2", async ({ page }) => {
    await injectCart(page, [{ ...MOCK_ITEM, quantity: 2 }]);
    await page.locator("button[aria-label^='Open cart']").click();
    // 2 × R150 = R300
    await expect(page.locator("body")).toContainText(/300|R\s*300/i, { timeout: 5_000 });
  });
});

// ─── Checkout navigation ──────────────────────────────────────────────────────

test.describe("Cart — checkout", () => {
  test("checkout button/link is present when cart has items", async ({ page }) => {
    await page.goto("/");
    const product = { id: "test-product-2", name: "Test Ork Boy", price: 80, quantity: 1, imageUrl: "", printType: "FDM" };
    await page.evaluate((p) => {
      localStorage.setItem("yarik-cart", JSON.stringify({ state: { items: [p] }, version: 0 }));
    }, product);
    await page.reload();
    await page.locator("button[aria-label^='Open cart']").click();
    await page.waitForTimeout(500);
    // CartDrawer shows "VIEW CART & CHECKOUT" link
    await expect(
      page.getByRole("link", { name: /checkout|view cart/i })
    ).toBeVisible({ timeout: 5_000 });
  });
});
