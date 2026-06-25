import { expect, test } from "@playwright/test"

// Pixel diff tolerance — 1% accounts for sub-pixel anti-aliasing differences
const DIFF_RATIO = 0.01

test.describe("Visual regression — closed state", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo")
    await page.waitForLoadState("networkidle")
    // Wait for fonts and layout to settle
    await page.waitForTimeout(200)
  })

  test("default select (placeholder)", async ({ page }) => {
    const el = page.locator('[role="combobox"]').first()
    await expect(el).toHaveScreenshot("select-closed-default.png", {
      maxDiffPixelRatio: DIFF_RATIO,
    })
  })

  test("size variants — sm / md / lg", async ({ page }) => {
    const sm = page.locator('[data-size="small"]').first()
    const md = page.locator('[data-size="middle"]').first()
    const lg = page.locator('[data-size="large"]').first()

    if ((await sm.count()) > 0) {
      await expect(sm).toHaveScreenshot("select-size-sm.png", { maxDiffPixelRatio: DIFF_RATIO })
    }
    if ((await md.count()) > 0) {
      await expect(md).toHaveScreenshot("select-size-md.png", { maxDiffPixelRatio: DIFF_RATIO })
    }
    if ((await lg.count()) > 0) {
      await expect(lg).toHaveScreenshot("select-size-lg.png", { maxDiffPixelRatio: DIFF_RATIO })
    }
  })

  test("error status select", async ({ page }) => {
    const el = page.locator('[data-status="error"]').first()
    if ((await el.count()) > 0) {
      await expect(el).toHaveScreenshot("select-status-error.png", { maxDiffPixelRatio: DIFF_RATIO })
    }
  })

  test("warning status select", async ({ page }) => {
    const el = page.locator('[data-status="warning"]').first()
    if ((await el.count()) > 0) {
      await expect(el).toHaveScreenshot("select-status-warning.png", { maxDiffPixelRatio: DIFF_RATIO })
    }
  })

  test("disabled select", async ({ page }) => {
    const el = page.locator('[role="combobox"][aria-disabled="true"]').first()
    if ((await el.count()) > 0) {
      await expect(el).toHaveScreenshot("select-disabled.png", { maxDiffPixelRatio: DIFF_RATIO })
    }
  })

  test("loading select", async ({ page }) => {
    const el = page.locator('[data-loading="true"]').first()
    if ((await el.count()) > 0) {
      await expect(el).toHaveScreenshot("select-loading.png", { maxDiffPixelRatio: DIFF_RATIO })
    }
  })
})

test.describe("Visual regression — selected state", () => {
  test("single select with value selected", async ({ page }) => {
    await page.goto("/demo")
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(200)

    const trigger = page.locator('[role="combobox"]').first()
    await trigger.click()
    await page.waitForSelector('[role="listbox"]')
    await page
      .locator('[data-gjs-select-option]:not([data-disabled])')
      .first()
      .click()
    await page.waitForSelector('[role="listbox"]', { state: "hidden" })
    await page.waitForTimeout(100)

    await expect(trigger).toHaveScreenshot("select-with-value.png", { maxDiffPixelRatio: DIFF_RATIO })
  })

  test("multiple select with tags", async ({ page }) => {
    await page.goto("/demo")
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(200)

    const multi = page.locator('[aria-multiselectable="true"]').first()
    if ((await multi.count()) === 0) {
      test.skip()
      return
    }

    await multi.click()
    await page.waitForSelector('[role="listbox"]')
    const items = page.locator('[data-gjs-select-option]:not([data-disabled])')
    await items.nth(0).click()
    await items.nth(1).click()
    await page.keyboard.press("Escape")
    await page.waitForTimeout(100)

    await expect(multi).toHaveScreenshot("select-multiple-tags.png", { maxDiffPixelRatio: DIFF_RATIO })
  })
})

test.describe("Visual regression — open/dropdown state", () => {
  test("dropdown list appearance", async ({ page }) => {
    await page.goto("/demo")
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(200)

    await page.locator('[role="combobox"]').first().click()
    await page.waitForSelector('[role="listbox"]')
    await page.waitForTimeout(100) // animation settle

    await expect(page).toHaveScreenshot("select-dropdown-open.png", {
      maxDiffPixelRatio: DIFF_RATIO,
      // Clip to viewport to avoid capturing system UI
      clip: { x: 0, y: 0, width: 1280, height: 720 },
    })
  })

  test("dropdown with active/highlighted item", async ({ page }) => {
    await page.goto("/demo")
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(200)

    await page.locator('[role="combobox"]').first().click()
    await page.waitForSelector('[role="listbox"]')
    await page.keyboard.press("ArrowDown")
    await page.waitForTimeout(50)

    const list = page.locator('[role="listbox"]').first()
    await expect(list).toHaveScreenshot("select-dropdown-highlighted.png", { maxDiffPixelRatio: DIFF_RATIO })
  })

  test("dropdown with option groups", async ({ page }) => {
    await page.goto("/demo")
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(200)

    // Open the grouped select
    const grouped = page.locator('[role="combobox"]').filter({ hasText: /group|category/i }).first()
    if ((await grouped.count()) > 0) {
      await grouped.click()
    } else {
      // Try second or third select that might be grouped
      await page.locator('[role="combobox"]').nth(2).click()
    }
    await page.waitForSelector('[role="listbox"]')
    await page.waitForTimeout(100)

    const list = page.locator('[role="listbox"]').first()
    await expect(list).toHaveScreenshot("select-dropdown-groups.png", { maxDiffPixelRatio: DIFF_RATIO })
  })
})

test.describe("Visual regression — hover & focus states", () => {
  test("trigger focus ring is visible", async ({ page }) => {
    await page.goto("/demo")
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(200)

    // Tab to focus the first combobox
    await page.keyboard.press("Tab")
    let attempts = 0
    while ((await page.locator("[role=combobox]:focus").count()) === 0 && attempts < 10) {
      await page.keyboard.press("Tab")
      attempts++
    }
    await page.waitForTimeout(50)

    const trigger = page.locator("[role=combobox]:focus").first()
    if ((await trigger.count()) > 0) {
      await expect(trigger).toHaveScreenshot("select-focused.png", { maxDiffPixelRatio: DIFF_RATIO })
    }
  })
})
