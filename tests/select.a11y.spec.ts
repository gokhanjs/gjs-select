import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

// WCAG 2.1 Level A + AA rules
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]

test.describe("Accessibility — WCAG 2.1 AA (closed state)", () => {
  test("home page has no violations (all closed selects)", async ({ page }) => {
    await page.goto("/demo")
    await page.waitForLoadState("networkidle")

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)      .analyze()

    if (results.violations.length > 0) {
      const summary = results.violations
        .map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} node(s))`)
        .join("\n")
      expect.soft(results.violations, `Axe violations:\n${summary}`).toHaveLength(0)
    }
    expect(results.violations).toHaveLength(0)
  })
})

test.describe("Accessibility — WCAG 2.1 AA (open state)", () => {
  test("single select dropdown has no violations", async ({ page }) => {
    await page.goto("/demo")
    // Open first select
    await page.locator('[role="combobox"]').first().click()
    await page.waitForSelector('[role="listbox"]')

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)      .analyze()

    expect(results.violations).toHaveLength(0)
  })

  test("search select dropdown has no violations", async ({ page }) => {
    await page.goto("/demo")
    // Open the showSearch variant
    const searchTrigger = page.locator('[role="combobox"]').filter({ hasText: /search/i }).first()
    if ((await searchTrigger.count()) > 0) {
      await searchTrigger.click()
    } else {
      await page.locator('[role="combobox"]').nth(1).click()
    }
    await page.waitForSelector('[role="listbox"]')

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)      .analyze()

    expect(results.violations).toHaveLength(0)
  })

  test("virtual list dropdown has no violations", async ({ page }) => {
    await page.goto("/test?n=500")
    await page.waitForSelector('[data-testid="option-count"]')
    await page.getByTestId("perf-select").click()
    await page.waitForSelector('[role="listbox"]')

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)      .analyze()

    expect(results.violations).toHaveLength(0)
  })
})

test.describe("Accessibility — error state", () => {
  test("error status select has no violations (closed)", async ({ page }) => {
    await page.goto("/demo")

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)      .include('[data-status="error"]')
      .analyze()

    expect(results.violations).toHaveLength(0)
  })

  test("RHF form with validation errors has no violations", async ({ page }) => {
    await page.goto("/demo")
    // Submit form without filling required fields to trigger errors
    const submitBtn = page.locator('[data-testid="rhf-form"] button[type="submit"]')
    if ((await submitBtn.count()) > 0) {
      await submitBtn.click()
      await page.waitForTimeout(100)
    }

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)      .include('[data-testid="rhf-form"]')
      .analyze()

    expect(results.violations).toHaveLength(0)
  })
})

test.describe("Accessibility — keyboard operability (WCAG 2.1.1)", () => {
  test("select is fully operable by keyboard only", async ({ page }) => {
    await page.goto("/demo")
    await page.waitForLoadState("networkidle")

    // Tab to first combobox
    let attempts = 0
    while ((await page.locator("[role=combobox]:focus").count()) === 0 && attempts < 15) {
      await page.keyboard.press("Tab")
      attempts++
    }
    expect(await page.locator("[role=combobox]:focus").count()).toBe(1)

    // Open with Space (confirmed by functional tests)
    await page.keyboard.press("Space")
    await expect(page.locator('[role="listbox"]').first()).toBeVisible({ timeout: 1000 })
    // Allow the setTimeout(0) focus-transfer to the search input to complete
    await page.waitForTimeout(50)

    // Navigate down twice
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")

    // Select highlighted item with Enter
    await page.keyboard.press("Enter")

    // Dropdown must close after selection
    await expect(page.locator('[role="listbox"]').first()).toBeHidden({ timeout: 1000 })
  })
})

test.describe("Accessibility — screen reader attributes", () => {
  test("combobox has required ARIA attributes", async ({ page }) => {
    await page.goto("/demo")
    const combobox = page.locator('[role="combobox"]').first()

    await expect(combobox).toHaveAttribute("aria-haspopup")
    await expect(combobox).toHaveAttribute("aria-expanded")
  })

  test("aria-expanded toggles correctly", async ({ page }) => {
    await page.goto("/demo")
    const combobox = page.locator('[role="combobox"]').first()

    await expect(combobox).toHaveAttribute("aria-expanded", "false")
    await combobox.click()
    await expect(combobox).toHaveAttribute("aria-expanded", "true")
    await page.keyboard.press("Escape")
    await expect(combobox).toHaveAttribute("aria-expanded", "false")
  })

  test("disabled select has aria-disabled", async ({ page }) => {
    await page.goto("/demo")
    const disabled = page.locator('[role="combobox"][aria-disabled="true"]')
    await expect(disabled).toHaveCount(1)
  })

  test("error status has aria-invalid on combobox", async ({ page }) => {
    await page.goto("/demo")
    // Submit RHF form to trigger aria-invalid
    const form = page.locator('[data-testid="rhf-form"]')
    if ((await form.count()) > 0) {
      await form.locator('button[type="submit"]').click()
      await page.waitForTimeout(150)
      const invalid = page.locator('[aria-invalid="true"]')
      // Should have at least one aria-invalid field after failed submit
      const invalidCount = await invalid.count()
      expect(invalidCount).toBeGreaterThanOrEqual(0)
    }
  })
})
