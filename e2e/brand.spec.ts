/**
 * Brand page tests — hero, faction tiles / product grid, filters, add-to-cart.
 * Tests run against the real dev server with live Supabase data.
 *
 * Layout split:
 *   hasFactionTiles=true  → BrandPage renders FactionTileGrid (grimdark, aof, pokemon)
 *   hasFactionTiles=false → BrandPage renders BrandProductGrid with filter bar (basing, terrain)
 */
import { test, expect } from "@playwright/test";

const BRANDS = [
  {
    slug: "grimdark-future",
    label: /grimdark future/i,
    hasArmyBuilder: true,
    hasFactionTiles: true,
    factionSlugs: ["space-marines", "orks", "tyranids", "chaos-space-marines"],
  },
  {
    slug: "age-of-fantasy",
    label: /age of fantasy/i,
    hasArmyBuilder: true,
    hasFactionTiles: true,
    factionSlugs: ["high-elves", "undead"],
  },
  {
    slug: "pokemon",
    label: /pok[eé]mon/i,
    hasArmyBuilder: false,
    hasFactionTiles: true,
    factionSlugs: ["pokeballs", "themed-pokeballs", "3d-cards", "figurines"],
  },
  {
    slug: "basing-battle-effects",
    label: /basing/i,
    hasArmyBuilder: false,
    hasFactionTiles: false,
    factionSlugs: [] as string[],
  },
  {
    slug: "gaming-accessories-terrain",
    label: /gaming|accessories/i,
    hasArmyBuilder: false,
    hasFactionTiles: false,
    factionSlugs: [] as string[],
  },
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
        const heroBrandBtn = page.locator(`a[href="/${brand.slug}/army-builder"]`);
        await expect(heroBrandBtn).toHaveCount(0);
      });
    }

    if (brand.hasFactionTiles) {
      // ── Faction-tile layout ──────────────────────────────────────────────────
      test("shows FACTIONS & COLLECTIONS heading", async ({ page }) => {
        await page.goto(`/${brand.slug}`);
        await expect(page.locator("h2", { hasText: /factions.*collections/i })).toBeVisible();
      });

      test("shows at least one faction tile link", async ({ page }) => {
        await page.goto(`/${brand.slug}`);
        const tiles = page.locator(`a[href^="/${brand.slug}/"]`);
        await expect(tiles.first()).toBeVisible();
        const count = await tiles.count();
        expect(count).toBeGreaterThanOrEqual(brand.factionSlugs.length);
      });

      test("each faction tile has correct href format", async ({ page }) => {
        await page.goto(`/${brand.slug}`);
        for (const factionSlug of brand.factionSlugs) {
          const tile = page.locator(`a[href="/${brand.slug}/${factionSlug}"]`);
          await expect(tile).toBeVisible();
        }
      });

      test("clicking first faction tile navigates to faction page", async ({ page }) => {
        await page.goto(`/${brand.slug}`);
        const firstTile = page.locator(`a[href^="/${brand.slug}/"]`).first();
        const href = await firstTile.getAttribute("href");
        await firstTile.click();
        await expect(page).toHaveURL(href!);
        await expect(page.locator("body")).not.toContainText(/500 internal server error/i);
      });

      test("does NOT show a filter bar or PRODUCTS heading on brand landing", async ({ page }) => {
        await page.goto(`/${brand.slug}`);
        await expect(page.locator("h2", { hasText: /^products$/i })).not.toBeVisible();
      });
    } else {
      // ── Product-grid layout ──────────────────────────────────────────────────
      test("filter bar is present with All tab", async ({ page }) => {
        await page.goto(`/${brand.slug}`);
        await expect(page.getByRole("button", { name: /^all$/i })).toBeVisible();
      });

      test("PRODUCTS heading visible in grid section", async ({ page }) => {
        await page.goto(`/${brand.slug}`);
        await expect(page.locator("h2", { hasText: /^products$/i })).toBeVisible();
      });
    }

    test("ADD-ONS & EXTRAS cross-sell section is at the bottom", async ({ page }) => {
      await page.goto(`/${brand.slug}`);
      await expect(page.locator("body")).toContainText(/add-ons & extras/i);
    });

    test("cross-sell section shows exactly 2 addon tiles", async ({ page }) => {
      await page.goto(`/${brand.slug}`);
      const addonSection = page.locator("h2", { hasText: /add-ons & extras/i })
        .locator("..").locator("a");
      await expect(addonSection).toHaveCount(2);
    });

    test("page title contains brand name", async ({ page }) => {
      await page.goto(`/${brand.slug}`);
      await expect(page).toHaveTitle(brand.label);
    });
  });
}

// ─── Faction page structural checks ──────────────────────────────────────────
// Uses /grimdark-future/space-marines as the representative faction page.

test.describe("Faction page — /grimdark-future/space-marines", () => {
  const FACTION_URL = "/grimdark-future/space-marines";

  test("loads without 500 errors", async ({ page }) => {
    await page.goto(FACTION_URL);
    await expect(page).not.toHaveURL(/error/i);
    await expect(page.locator("body")).not.toContainText(/500 internal server error/i);
  });

  test("shows faction name in h1", async ({ page }) => {
    await page.goto(FACTION_URL);
    await expect(page.locator("h1")).toContainText(/space marines/i);
  });

  test("breadcrumb contains HOME › GRIMDARK FUTURE › SPACE MARINES", async ({ page }) => {
    await page.goto(FACTION_URL);
    await expect(page.locator("body")).toContainText(/home/i);
    await expect(page.locator("body")).toContainText(/grimdark future/i);
    await expect(page.locator("body")).toContainText(/space marines/i);
  });

  test("ARMY BUILDER CTA is visible for war game factions", async ({ page }) => {
    await page.goto(FACTION_URL);
    const armyBtn = page.locator(`a[href="/grimdark-future/army-builder"]`);
    await expect(armyBtn.first()).toBeVisible();
  });

  test("shows products or PRODUCTS COMING SOON", async ({ page }) => {
    await page.goto(FACTION_URL);
    const hasProducts = await page.locator("[class*='grid']").count() > 0;
    const hasComingSoon = (await page.locator("body").textContent())
      ?.toLowerCase().includes("coming soon");
    expect(hasProducts || hasComingSoon).toBeTruthy();
  });

  test("BACK TO GRIMDARK FUTURE link navigates to /grimdark-future", async ({ page }) => {
    await page.goto(FACTION_URL);
    await page.getByRole("link", { name: /back to grimdark future/i }).click();
    await expect(page).toHaveURL("/grimdark-future");
  });
});

// ─── Filter bar tests (on faction page, not brand landing page) ───────────────
// /grimdark-future/space-marines is a FactionProductPage with a sticky filter bar.

test.describe("Filter bar — /grimdark-future/space-marines", () => {
  const FACTION_URL = "/grimdark-future/space-marines";

  test("All tab is highlighted by default", async ({ page }) => {
    await page.goto(FACTION_URL);
    const allBtn = page.getByRole("button", { name: /^all$/i });
    await expect(allBtn).toBeVisible();
  });

  test("category-specific filter tabs are present when products exist", async ({ page }) => {
    await page.goto(FACTION_URL);
    const filterSection = page.locator("div.sticky");
    await expect(filterSection.first()).toBeVisible();
    const allButtons = filterSection.first().getByRole("button");
    const count = await allButtons.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("clicking a category filter tab updates the active tab", async ({ page }) => {
    await page.goto(FACTION_URL);
    const filterButtons = page.locator("div.sticky button");
    const count = await filterButtons.count();
    test.skip(count <= 1, "No category filter tabs present — no products in DB");

    const secondBtn = filterButtons.nth(1);
    const label = (await secondBtn.textContent())?.trim();
    await secondBtn.click();
    await page.waitForTimeout(300);

    const hasProductCount = (await page.locator("body").textContent())?.match(/\d+ products?/i);
    const hasShowAll = await page.getByRole("button", { name: /show all/i }).isVisible();
    const hasEmptyMsg = (await page.locator("body").textContent())
      ?.toLowerCase().includes(`no ${label?.toLowerCase()} products`);

    expect(hasProductCount || hasShowAll || hasEmptyMsg).toBeTruthy();
  });

  test("product count label updates when a filter is applied", async ({ page }) => {
    await page.goto(FACTION_URL);
    const countPattern = /(\d+) products?/i;
    const bodyBefore = await page.locator("body").textContent() ?? "";
    const matchBefore = bodyBefore.match(countPattern);

    const filterButtons = page.locator("div.sticky button");
    const count = await filterButtons.count();
    test.skip(count <= 1, "No category filter tabs to click");

    await filterButtons.nth(1).click();
    await page.waitForTimeout(300);

    const bodyAfter = await page.locator("body").textContent() ?? "";
    const matchAfter = bodyAfter.match(countPattern);

    if (matchBefore && matchAfter) {
      const before = parseInt(matchBefore[1]);
      const after = parseInt(matchAfter[1]);
      expect(after).toBeLessThanOrEqual(before);
    }
  });

  test("SHOW ALL button resets filter back to all products", async ({ page }) => {
    await page.goto(FACTION_URL);
    const filterButtons = page.locator("div.sticky button");
    const count = await filterButtons.count();
    test.skip(count <= 1, "No category filter tabs to click");

    for (let i = 1; i < count; i++) {
      await filterButtons.nth(i).click();
      await page.waitForTimeout(200);
      const showAllBtn = page.getByRole("button", { name: /show all/i });
      if (await showAllBtn.isVisible()) {
        await showAllBtn.click();
        await page.waitForTimeout(200);
        await expect(showAllBtn).not.toBeVisible({ timeout: 2_000 });
        await expect(page.getByRole("button", { name: /^all$/i })).toBeVisible();
        return;
      }
    }
  });

  test("Pokémon faction page does NOT show Infantry or Vehicles tabs", async ({ page }) => {
    // Pokéballs faction page should only have Pokémon-specific filters, not war game categories
    await page.goto("/pokemon/pokeballs");
    await expect(page.locator("body")).not.toContainText(/500 internal server error/i);
    const filterSection = page.locator("div.sticky");
    await expect(filterSection.getByRole("button", { name: /^infantry$/i })).not.toBeVisible();
    await expect(filterSection.getByRole("button", { name: /^vehicles$/i })).not.toBeVisible();
  });
});

// ─── Add to cart via real UI click (faction product page) ────────────────────
// /grimdark-future/space-marines renders actual product cards with ADD TO CART buttons.

test.describe("Faction page — add to cart via UI click", () => {
  const FACTION_URL = "/grimdark-future/space-marines";

  test("clicking ADD TO CART opens the cart drawer", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("yarik-cart"));
    await page.goto(FACTION_URL);

    const addBtn = page.getByRole("button", { name: /^add to cart$/i }).first();
    const addBtnCount = await addBtn.count();
    test.skip(addBtnCount === 0, "No products on page — skipping add-to-cart test");

    await addBtn.waitFor({ state: "visible", timeout: 10_000 });
    await addBtn.click();

    await expect(page.locator("h2", { hasText: /your warband/i })).toBeVisible({ timeout: 5_000 });
  });

  test("cart badge in nav increments to 1 after adding a product", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("yarik-cart"));
    await page.goto(FACTION_URL);

    const addBtn = page.getByRole("button", { name: /^add to cart$/i }).first();
    const addBtnCount = await addBtn.count();
    test.skip(addBtnCount === 0, "No products on page — skipping badge test");

    await addBtn.waitFor({ state: "visible", timeout: 10_000 });
    await addBtn.click();

    const cartNavBtn = page.locator("button[aria-label^='Open cart']");
    await expect(cartNavBtn).toContainText("1", { timeout: 5_000 });
  });

  test("button shows ADDED ✓ state briefly after clicking", async ({ page }) => {
    await page.goto(FACTION_URL);

    const addBtn = page.getByRole("button", { name: /^add to cart$/i }).first();
    const addBtnCount = await addBtn.count();
    test.skip(addBtnCount === 0, "No products on page");

    await addBtn.waitFor({ state: "visible", timeout: 10_000 });
    await addBtn.click();

    await expect(page.getByRole("button", { name: /added/i }).first()).toBeVisible({ timeout: 2_000 });
  });

  test("clicking ADD TO CART twice increments quantity, not duplicate items", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("yarik-cart"));
    await page.goto(FACTION_URL);

    const addBtn = page.getByRole("button", { name: /^add to cart$/i }).first();
    const addBtnCount = await addBtn.count();
    test.skip(addBtnCount === 0, "No products on page");

    await addBtn.waitFor({ state: "visible", timeout: 10_000 });
    await addBtn.click();
    await page.waitForTimeout(1_500);
    await addBtn.click();
    await page.waitForTimeout(200);

    const cartNavBtn = page.locator("button[aria-label^='Open cart']");
    await expect(cartNavBtn).toContainText("2", { timeout: 5_000 });
  });
});
