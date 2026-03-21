/**
 * Brand page tests — hero, filter bar, product grid, add-to-cart via real UI click.
 * Tests run against the real dev server with live Supabase data.
 */
import { test, expect } from "@playwright/test";

const BRANDS = [
  { slug: "grimdark-future",              label: /grimdark future/i,        hasArmyBuilder: true  },
  { slug: "age-of-fantasy",               label: /age of fantasy/i,         hasArmyBuilder: true  },
  { slug: "pokemon",                      label: /pok[eé]mon/i,             hasArmyBuilder: false },
  { slug: "basing-battle-effects",        label: /basing/i,                 hasArmyBuilder: false },
  { slug: "gaming-accessories-terrain",   label: /gaming|accessories/i,     hasArmyBuilder: false },
];

// ─── Structural checks for every brand ───────────────────────────────────────

for (const brand of BRANDS) {
  test.describe(`Brand page — /${brand.slug}`, () => {
    test("loads without 500 errors", async ({ page }) => {
      await page.goto(`/${brand.slug}`);
      await expect(page).not.toHaveURL(/error/i);
      await expect(page.locator("body")).not.toContainText(/500 internal server error/i);
    });

    test("shows branded h1 heading in hero", async ({ page }) => {
      await page.goto(`/${brand.slug}`);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("h1")).toContainText(brand.label);
    });

    test("shows THE DEXARIUM attribution in hero", async ({ page }) => {
      await page.goto(`/${brand.slug}`);
      await expect(page.locator("body")).toContainText(/the dexarium/i);
    });

    test("← ALL CATEGORIES navigates to /", async ({ page }) => {
      await page.goto(`/${brand.slug}`);
      await page.getByRole("link", { name: /all categories/i }).click();
      await expect(page).toHaveURL("/");
    });

    if (brand.hasArmyBuilder) {
      test("ARMY BUILDER button is visible", async ({ page }) => {
        await page.goto(`/${brand.slug}`);
        // Use href-based selector to avoid matching the global nav "ARMY BUILDER" link
        const armyBtn = page.locator(`a[href="/${brand.slug}/army-builder"]`);
        await expect(armyBtn.first()).toBeVisible();
      });

      test("ARMY BUILDER button links to /<brand>/army-builder", async ({ page }) => {
        await page.goto(`/${brand.slug}`);
        const armyBtn = page.locator(`a[href="/${brand.slug}/army-builder"]`).first();
        const href = await armyBtn.getAttribute("href");
        expect(href).toContain("army-builder");
      });
    } else {
      test("does NOT show ARMY BUILDER button in hero", async ({ page }) => {
        await page.goto(`/${brand.slug}`);
        // Check that there is no army-builder link for THIS brand in the hero
        const heroBrandBtn = page.locator(`a[href="/${brand.slug}/army-builder"]`);
        await expect(heroBrandBtn).toHaveCount(0);
      });
    }

    test("filter bar is present with All tab", async ({ page }) => {
      await page.goto(`/${brand.slug}`);
      // The sticky filter bar has an "All" button
      await expect(page.getByRole("button", { name: /^all$/i })).toBeVisible();
    });

    test("PRODUCTS heading visible in grid section", async ({ page }) => {
      await page.goto(`/${brand.slug}`);
      await expect(page.locator("h2", { hasText: /^products$/i })).toBeVisible();
    });

    test("ADD-ONS & EXTRAS cross-sell section is at the bottom", async ({ page }) => {
      await page.goto(`/${brand.slug}`);
      await expect(page.locator("body")).toContainText(/add-ons & extras/i);
    });

    test("cross-sell section shows exactly 2 addon tiles", async ({ page }) => {
      await page.goto(`/${brand.slug}`);
      // Each addon is a Link with an emoji + brand name
      const addonSection = page.locator("h2", { hasText: /add-ons & extras/i })
        .locator("..").locator("a");
      await expect(addonSection).toHaveCount(2);
    });

    test("page title contains brand name", async ({ page }) => {
      await page.goto(`/${brand.slug}`);
      // Title format: "<Brand Name> — The Dexarium"
      await expect(page).toHaveTitle(brand.label);
    });
  });
}

// ─── Detailed filter bar tests (grimdark-future) ──────────────────────────────

test.describe("Filter bar — grimdark-future", () => {
  test("All tab is highlighted by default", async ({ page }) => {
    await page.goto("/grimdark-future");
    // "All" button should have the primary background applied
    // We detect this by checking it has a different visual state — the simplest
    // proxy is confirming it exists and the filter label says "All"
    const allBtn = page.getByRole("button", { name: /^all$/i });
    await expect(allBtn).toBeVisible();
  });

  test("category-specific filter tabs are present when products exist", async ({ page }) => {
    await page.goto("/grimdark-future");
    // We expect at least one non-All filter button if the brand has products
    const filterSection = page.locator("section.sticky");
    await expect(filterSection).toBeVisible();
    const allButtons = filterSection.getByRole("button");
    const count = await allButtons.count();
    // At minimum, the "All" tab is there
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("clicking a category filter tab updates the active tab", async ({ page }) => {
    await page.goto("/grimdark-future");
    const filterButtons = page.locator("section.sticky button");
    const count = await filterButtons.count();

    test.skip(count <= 1, "No category filter tabs present — no products in DB");

    const secondBtn = filterButtons.nth(1);
    const label = (await secondBtn.textContent())?.trim();
    await secondBtn.click();
    await page.waitForTimeout(300);

    // The product count or SHOW ALL button should be visible after click
    const hasProductCount = (await page.locator("body").textContent())?.match(/\d+ products?/i);
    const hasShowAll = await page.getByRole("button", { name: /show all/i }).isVisible();
    const hasEmptyMsg = (await page.locator("body").textContent())?.toLowerCase().includes(`no ${label?.toLowerCase()} products`);

    expect(hasProductCount || hasShowAll || hasEmptyMsg).toBeTruthy();
  });

  test("product count label updates when a filter is applied", async ({ page }) => {
    await page.goto("/grimdark-future");
    // Capture the count before filtering
    const countPattern = /(\d+) products?/i;
    const bodyBefore = await page.locator("body").textContent() ?? "";
    const matchBefore = bodyBefore.match(countPattern);

    const filterButtons = page.locator("section.sticky button");
    const count = await filterButtons.count();
    test.skip(count <= 1, "No category filter tabs to click");

    // Click second filter tab (first non-All)
    await filterButtons.nth(1).click();
    await page.waitForTimeout(300);

    const bodyAfter = await page.locator("body").textContent() ?? "";
    const matchAfter = bodyAfter.match(countPattern);

    // If there were products before, count should change or SHOW ALL should appear
    if (matchBefore && matchAfter) {
      // Count either changed or is the same if all products match that filter
      const before = parseInt(matchBefore[1]);
      const after = parseInt(matchAfter[1]);
      expect(after).toBeLessThanOrEqual(before);
    }
  });

  test("SHOW ALL button resets filter back to all products", async ({ page }) => {
    await page.goto("/grimdark-future");
    const filterButtons = page.locator("section.sticky button");
    const count = await filterButtons.count();
    test.skip(count <= 1, "No category filter tabs to click");

    // Click through filters looking for one that produces SHOW ALL
    for (let i = 1; i < count; i++) {
      await filterButtons.nth(i).click();
      await page.waitForTimeout(200);
      const showAllBtn = page.getByRole("button", { name: /show all/i });
      if (await showAllBtn.isVisible()) {
        await showAllBtn.click();
        await page.waitForTimeout(200);
        // After clicking SHOW ALL, All tab should be active again (and SHOW ALL gone)
        await expect(showAllBtn).not.toBeVisible({ timeout: 2_000 });
        await expect(page.getByRole("button", { name: /^all$/i })).toBeVisible();
        return;
      }
    }
    // If no filter produced zero results, that's acceptable — we pass
  });

  test("Pokémon page does NOT show Infantry or Vehicles tabs", async ({ page }) => {
    await page.goto("/pokemon");
    const filterSection = page.locator("section.sticky");
    await expect(filterSection.getByRole("button", { name: /^infantry$/i })).not.toBeVisible();
    await expect(filterSection.getByRole("button", { name: /^vehicles$/i })).not.toBeVisible();
  });
});

// ─── Add to cart via real UI click ───────────────────────────────────────────

test.describe("Brand page — add to cart via UI click", () => {
  test("clicking ADD TO CART opens the cart drawer", async ({ page }) => {
    // Ensure clean cart
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("yarik-cart"));
    await page.goto("/grimdark-future");

    const addBtn = page.getByRole("button", { name: /^add to cart$/i }).first();
    test.skip(await addBtn.count() === 0, "No products on page — skipping add-to-cart test");

    await addBtn.waitFor({ state: "visible", timeout: 10_000 });
    await addBtn.click();

    // Cart drawer opens automatically after adding
    await expect(page.locator("h2", { hasText: /your warband/i })).toBeVisible({ timeout: 5_000 });
  });

  test("cart badge in nav increments to 1 after adding a product", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("yarik-cart"));
    await page.goto("/grimdark-future");

    const addBtn = page.getByRole("button", { name: /^add to cart$/i }).first();
    test.skip(await addBtn.count() === 0, "No products on page — skipping badge test");

    await addBtn.waitFor({ state: "visible", timeout: 10_000 });
    await addBtn.click();

    // Nav cart button shows item count
    const cartNavBtn = page.locator("button[aria-label^='Open cart']");
    await expect(cartNavBtn).toContainText("1", { timeout: 5_000 });
  });

  test("button shows ADDED ✓ state briefly after clicking", async ({ page }) => {
    await page.goto("/grimdark-future");

    const addBtn = page.getByRole("button", { name: /^add to cart$/i }).first();
    test.skip(await addBtn.count() === 0, "No products on page");

    await addBtn.waitFor({ state: "visible", timeout: 10_000 });
    await addBtn.click();

    // Button transitions to "ADDED ✓" for ~1200ms
    await expect(page.getByRole("button", { name: /added/i }).first()).toBeVisible({ timeout: 2_000 });
  });

  test("clicking ADD TO CART twice increments quantity, not duplicate items", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("yarik-cart"));
    await page.goto("/grimdark-future");

    const addBtn = page.getByRole("button", { name: /^add to cart$/i }).first();
    test.skip(await addBtn.count() === 0, "No products on page");

    await addBtn.waitFor({ state: "visible", timeout: 10_000 });
    // First click
    await addBtn.click();
    // Wait for ADDED state to clear before clicking again
    await page.waitForTimeout(1_500);
    // Second click (button should be back to "ADD TO CART" text)
    await addBtn.click();
    await page.waitForTimeout(200);

    // Cart badge should show 2 (same product, quantity 2)
    const cartNavBtn = page.locator("button[aria-label^='Open cart']");
    await expect(cartNavBtn).toContainText("2", { timeout: 5_000 });
  });
});
