/**
 * Army Builder — mobile collapsible summary panel.
 *
 * These tests require a live Supabase connection because the army-builder
 * page fetches products server-side. They are skipped automatically when
 * TEST_USER_EMAIL is not set (i.e. in stub/CI environments).
 */
import { test, expect } from "@playwright/test";

const requiresDb = !!process.env.TEST_USER_EMAIL;

test.describe("Army Builder — mobile collapsible summary", () => {
  test.skip(!requiresDb, "Skipped: requires live Supabase (set TEST_USER_EMAIL to enable)");

  test("mobile bottom bar is visible on the army builder page", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto("/grimdark-future/army-builder");
    // Fixed bottom bar is always rendered regardless of product count
    const bar = page.locator(".fixed.bottom-0.left-0.right-0.z-40").last();
    await expect(bar).toBeAttached({ timeout: 15_000 });
  });

  test("tapping WARBAND opens the summary sheet on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto("/grimdark-future/army-builder");

    const warbandButton = page.getByRole("button", { name: /warband/i }).first();
    await expect(warbandButton).toBeVisible({ timeout: 15_000 });
    await warbandButton.click();

    await expect(page.locator("body")).toContainText(/your warband/i, { timeout: 3_000 });
  });

  test("summary sheet has a CLOSE button", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto("/grimdark-future/army-builder");

    await page.getByRole("button", { name: /warband/i }).first().click();
    await expect(page.getByRole("button", { name: /close/i })).toBeVisible({ timeout: 3_000 });
  });

  test("closing the summary sheet hides YOUR WARBAND heading", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto("/grimdark-future/army-builder");

    await page.getByRole("button", { name: /warband/i }).first().click();
    await page.getByRole("button", { name: /close/i }).click();
    await expect(page.locator("body")).not.toContainText(/your warband/i, { timeout: 3_000 });
  });

  test("product grid uses 2 columns on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto("/grimdark-future/army-builder");
    // Find a product grid and verify it has grid-cols-2
    const grid = page.locator(".grid-cols-2").first();
    await expect(grid).toBeAttached({ timeout: 15_000 });
  });
});
