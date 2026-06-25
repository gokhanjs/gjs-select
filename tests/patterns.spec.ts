import { test, expect, type Page, type Locator } from "@playwright/test"

// ─── Helpers ────────────────────────────────────────────────────────────────

function triggerByLabel(page: Page, label: string): Locator {
  return page.locator(`[data-gjs-select-trigger][aria-label="${label}"]`)
}

function dropdown(page: Page): Locator {
  return page.locator("[data-gjs-select-dropdown]")
}

function option(page: Page, label: string): Locator {
  return page.locator("[data-gjs-select-option]").filter({ hasText: label })
}

function searchInput(page: Page): Locator {
  return page.locator("[data-gjs-select-trigger][data-open] [data-gjs-select-search]")
}

// ─── Setup ──────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await page.goto("/")
})

// ─── Debounced async search ────────────────────────────────────────────────────

test("async search: a debounced query hits the API route and shows server-filtered results", async ({ page }) => {
  const t = triggerByLabel(page, "Async country search")
  await t.scrollIntoViewIfNeeded()
  await t.click()
  await expect(dropdown(page)).toBeVisible()
  // No query yet — the empty state prompts the user to type.
  await expect(page.getByText("Type to search")).toBeVisible()

  const [res] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/search") && r.status() === 200),
    searchInput(page).fill("turk"),
  ])
  expect(res.url()).toContain("q=turk")

  await expect(option(page, "Turkey")).toBeVisible()
  await option(page, "Turkey").click()
  await expect(t.locator("[data-gjs-select-value]")).toHaveText("Turkey")
})

// ─── Responsive tag overflow ──────────────────────────────────────────────────

test("responsive tags: overflow collapses in a narrow box and expands when widened", async ({ page }) => {
  const t = triggerByLabel(page, "Responsive tags select")
  await t.scrollIntoViewIfNeeded()

  // Three long tags can't all fit the 256px box → a +N pill appears and fewer
  // than three tags stay visible.
  await expect(t.locator("[data-gjs-select-overflow-tag]")).toBeVisible()
  expect(await t.locator("[data-gjs-select-tag]").count()).toBeLessThan(3)

  // Force the container wide (escaping the parent cap) → every tag fits, pill gone.
  const box = t.locator("xpath=ancestor::div[contains(@class,'resize-x')]")
  await box.evaluate((el) => {
    const node = el as HTMLElement
    node.style.maxWidth = "none"
    node.style.width = "900px"
  })
  await expect(t.locator("[data-gjs-select-overflow-tag]")).toHaveCount(0)
  await expect(t.locator("[data-gjs-select-tag]")).toHaveCount(3)
})
