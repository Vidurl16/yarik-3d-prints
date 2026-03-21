/**
 * Cart interaction tests — quantity controls, remove, success and cancelled states.
 * Cart is Zustand + localStorage so items are injected directly for reliability.
 */
import { test, expect } from "@playwright/test";

const ITEM_A = { id: "test-iron-warrior", name: "Iron Warrior",  price: 150, quantity: 1, imageUrl: "", printType: "RESIN" };
const ITEM_B = { id: "test-space-hulk",   name: "Space Hulk",    price: 200, quantity: 1, imageUrl: "", printType: "FDM"   };

async function injectCart(
  page: import("@playwright/test").Page,
  items: object[]
) {
  await page.goto("/");
  await page.evaluate((cartItems) => {
    localStorage.setItem(
      "yarik-cart",
      JSON.stringify({ state: { items: cartItems }, version: 0 })
    );
  }, items);
  await page.goto("/cart");
}

// ─── Quantity controls ────────────────────────────────────────────────────────

test.describe("Cart — quantity controls", () => {
  test("+ button increases item quantity to 2", async ({ page }) => {
    await injectCart(page, [ITEM_A]);
    await expect(page.locator("body")).toContainText("Iron Warrior");

    await page.locator("button", { hasText: "+" }).first().click();

    // Quantity display should update to 2
    const quantityEl = page.locator("span.text-center", { hasText: "2" }).first();
    await expect(quantityEl).toBeVisible({ timeout: 3_000 });
  });

  test("+ button doubles the line total", async ({ page }) => {
    await injectCart(page, [ITEM_A]); // R150

    await page.locator("button", { hasText: "+" }).first().click();

    // 2 × R150 = R300 — should appear somewhere in the page
    await expect(page.locator("body")).toContainText(/300/, { timeout: 3_000 });
  });

  test("− button decreases quantity from 2 to 1", async ({ page }) => {
    await injectCart(page, [{ ...ITEM_A, quantity: 2 }]);

    await page.locator("button", { hasText: "−" }).first().click();

    const quantityEl = page.locator("span.text-center", { hasText: "1" }).first();
    await expect(quantityEl).toBeVisible({ timeout: 3_000 });
  });

  test("− button at quantity 1 removes the item entirely", async ({ page }) => {
    await injectCart(page, [ITEM_A]);
    await expect(page.locator("body")).toContainText("Iron Warrior");

    await page.locator("button", { hasText: "−" }).first().click();

    // Cart should be empty now
    await expect(page.locator("body")).toContainText(
      /warband awaits|your cart is empty|no items/i,
      { timeout: 5_000 }
    );
  });

  test("remove (×) button deletes item immediately", async ({ page }) => {
    await injectCart(page, [ITEM_A]);
    await expect(page.locator("body")).toContainText("Iron Warrior");

    await page.locator("button[aria-label^='Remove']").first().click();

    await expect(page.locator("body")).toContainText(
      /warband awaits|your cart is empty|no items/i,
      { timeout: 5_000 }
    );
  });

  test("subtotal reflects correct total for two different items", async ({ page }) => {
    await injectCart(page, [ITEM_A, ITEM_B]); // R150 + R200 = R350
    await expect(page.locator("body")).toContainText(/350/);
  });

  test("subtotal updates after increasing a quantity", async ({ page }) => {
    await injectCart(page, [ITEM_A, ITEM_B]); // R350

    await page.locator("button", { hasText: "+" }).first().click();
    // Iron Warrior qty 2: R300 + R200 = R500
    await expect(page.locator("body")).toContainText(/500/, { timeout: 3_000 });
  });

  test("CLEAR CART button empties the whole cart", async ({ page }) => {
    await injectCart(page, [ITEM_A, ITEM_B]);
    await expect(page.locator("body")).toContainText("Iron Warrior");

    await page.getByRole("button", { name: /clear cart/i }).click();

    await expect(page.locator("body")).toContainText(
      /warband awaits|your cart is empty|no items/i,
      { timeout: 5_000 }
    );
  });

  test("PROCEED TO CHECKOUT button is visible when cart has items", async ({ page }) => {
    await injectCart(page, [ITEM_A]);
    await expect(
      page.getByRole("button", { name: /proceed to checkout/i })
    ).toBeVisible();
  });

  test("ORDER SUMMARY shows correct total", async ({ page }) => {
    await injectCart(page, [ITEM_A]); // R150
    const summary = page.locator("h2", { hasText: /order summary/i });
    await expect(summary).toBeVisible();
    await expect(page.locator("body")).toContainText(/150/);
  });
});

// ─── Success state (/cart?success=true) ──────────────────────────────────────

test.describe("Cart — success state (?success=true)", () => {
  test("shows PAYMENT PROCESSING heading", async ({ page }) => {
    await page.goto("/cart?success=true");
    await expect(page.locator("h1")).toContainText(/payment processing/i);
  });

  test("shows CONTINUE SHOPPING link", async ({ page }) => {
    await page.goto("/cart?success=true");
    await expect(page.getByRole("link", { name: /continue shopping/i })).toBeVisible();
  });

  test("CONTINUE SHOPPING link navigates to /shop", async ({ page }) => {
    await page.goto("/cart?success=true");
    await page.getByRole("link", { name: /continue shopping/i }).click();
    await expect(page).toHaveURL(/\/shop/);
  });

  test("shows order reference box when ?order= param is provided", async ({ page }) => {
    await page.goto("/cart?success=true&order=ref-abc-12345");
    await expect(page.locator("body")).toContainText(/order reference/i);
    await expect(page.locator("body")).toContainText("ref-abc-12345");
  });

  test("CHECK ORDER STATUS link appears when ?order= param provided", async ({ page }) => {
    await page.goto("/cart?success=true&order=some-order-ref");
    await expect(page.getByRole("link", { name: /check order status/i })).toBeVisible();
  });

  test("CHECK ORDER STATUS link points to /order-status with correct ref", async ({ page }) => {
    const orderId = "test-order-check-123";
    await page.goto(`/cart?success=true&order=${orderId}`);
    const statusLink = page.getByRole("link", { name: /check order status/i });
    const href = await statusLink.getAttribute("href");
    expect(href).toContain("/order-status");
    expect(href).toContain(orderId);
  });

  test("no ORDER REFERENCE box when no ?order= param", async ({ page }) => {
    await page.goto("/cart?success=true");
    // The ORDER REFERENCE box is only rendered when ?order= param is provided.
    // Check the code element (containing the order ID) is absent.
    await expect(page.locator("code")).toHaveCount(0);
  });

  test("success state does NOT show the checkout form or PROCEED TO CHECKOUT", async ({ page }) => {
    await page.goto("/cart?success=true");
    await expect(
      page.getByRole("button", { name: /proceed to checkout/i })
    ).not.toBeVisible();
  });

  test("cart is cleared after visiting the success URL", async ({ page }) => {
    // Pre-load a cart item
    await page.goto("/");
    await page.evaluate((item) => {
      localStorage.setItem(
        "yarik-cart",
        JSON.stringify({ state: { items: [item] }, version: 0 })
      );
    }, ITEM_A);

    // Visit success page — useEffect clears the cart
    await page.goto("/cart?success=true");
    await page.waitForTimeout(500); // let the effect fire

    // Navigate to cart without query — should be empty
    await page.goto("/cart");
    await expect(page.locator("body")).toContainText(
      /warband awaits|your cart is empty|no items/i
    );
  });
});

// ─── Cancelled state (/cart?cancelled=true) ───────────────────────────────────

test.describe("Cart — cancelled state (?cancelled=true)", () => {
  async function loadCancelledCart(page: import("@playwright/test").Page) {
    await page.goto("/");
    await page.evaluate((items) => {
      localStorage.setItem(
        "yarik-cart",
        JSON.stringify({ state: { items }, version: 0 })
      );
    }, [ITEM_A]);
    await page.goto("/cart?cancelled=true");
  }

  test("shows payment cancelled/declined banner", async ({ page }) => {
    await loadCancelledCart(page);
    await expect(page.locator("body")).toContainText(/cancelled|declined/i);
  });

  test("cancelled banner explains cart is intact", async ({ page }) => {
    await loadCancelledCart(page);
    await expect(page.locator("body")).toContainText(/cart is intact|try again/i);
  });

  test("contact support link is present in the banner", async ({ page }) => {
    await loadCancelledCart(page);
    await expect(page.getByRole("link", { name: /contact support/i })).toBeVisible();
  });

  test("cart items are preserved after cancellation", async ({ page }) => {
    await loadCancelledCart(page);
    await expect(page.locator("body")).toContainText("Iron Warrior");
  });

  test("PROCEED TO CHECKOUT button is still available after cancellation", async ({ page }) => {
    await loadCancelledCart(page);
    await expect(
      page.getByRole("button", { name: /proceed to checkout/i })
    ).toBeVisible();
  });

  test("cart page title is correct in cancelled state", async ({ page }) => {
    await loadCancelledCart(page);
    // Should still show YOUR WARBAND heading
    await expect(page.locator("h1")).toContainText(/your warband/i);
  });
});
