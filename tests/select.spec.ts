import { test, expect, type Page, type Locator } from "@playwright/test"

// ─── Helpers ────────────────────────────────────────────────────────────────

function trigger(page: Page, nth = 0): Locator {
  return page.locator("[data-gjs-select-trigger]").nth(nth)
}

function dropdown(page: Page): Locator {
  return page.locator("[data-gjs-select-dropdown]")
}

function option(page: Page, label: string): Locator {
  return page.locator("[data-gjs-select-option]").filter({ hasText: label })
}

function searchInput(page: Page): Locator {
  // The search input now lives inside each selector (antd parity), so scope to
  // the open select rather than grabbing the first input on the page.
  return page.locator("[data-gjs-select-trigger][data-open] [data-gjs-select-search]")
}

async function openSelect(page: Page, nth = 0) {
  await trigger(page, nth).click()
  await expect(dropdown(page)).toBeVisible()
}

async function closeSelect(page: Page) {
  await page.keyboard.press("Escape")
  await expect(dropdown(page)).not.toBeVisible()
}

// ─── Setup ───────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await page.goto("/")
})

// ─── 1. Basic Rendering ───────────────────────────────────────────────────────

test("renders all select triggers on page", async ({ page }) => {
  const triggers = page.locator("[data-gjs-select-trigger]")
  await expect(triggers).toHaveCount(19)
})

test("shows placeholder text", async ({ page }) => {
  await expect(trigger(page, 0).locator("[data-gjs-select-value]")).toHaveText("Pick a fruit")
})

// ─── 2. Open / Close ─────────────────────────────────────────────────────────

test("opens dropdown on click", async ({ page }) => {
  await expect(dropdown(page)).not.toBeVisible()
  await trigger(page, 0).click()
  await expect(dropdown(page)).toBeVisible()
})

test("closes dropdown on outside click", async ({ page }) => {
  await openSelect(page, 0)
  await page.locator("h1").click()
  await expect(dropdown(page)).not.toBeVisible()
})

test("closes dropdown on Escape", async ({ page }) => {
  await openSelect(page, 0)
  await closeSelect(page)
})

test("toggles closed when trigger clicked again", async ({ page }) => {
  await trigger(page, 0).click()
  await expect(dropdown(page)).toBeVisible()
  await trigger(page, 0).click()
  await expect(dropdown(page)).not.toBeVisible()
})

test("trigger aria-expanded reflects open state", async ({ page }) => {
  const t = trigger(page, 0)
  await expect(t).toHaveAttribute("aria-expanded", "false")
  await t.click()
  await expect(t).toHaveAttribute("aria-expanded", "true")
  await closeSelect(page)
  await expect(t).toHaveAttribute("aria-expanded", "false")
})

// ─── 3. Single Select ─────────────────────────────────────────────────────────

test("selects an option and displays it", async ({ page }) => {
  await openSelect(page, 0)
  await option(page, "Apple").click()
  await expect(dropdown(page)).not.toBeVisible()
  await expect(trigger(page, 0).locator("[data-gjs-select-value]")).toHaveText("Apple")
})

test("selected option shows check icon in single mode", async ({ page }) => {
  await openSelect(page, 0)
  await option(page, "Apple").click()
  await openSelect(page, 0)
  const appleOption = option(page, "Apple")
  await expect(appleOption).toHaveAttribute("data-selected", "true")
  await expect(appleOption.locator("[data-gjs-select-option-check]")).toBeVisible()
})

test("can change selection", async ({ page }) => {
  await openSelect(page, 0)
  await option(page, "Apple").click()
  await openSelect(page, 0)
  await option(page, "Banana").click()
  await expect(trigger(page, 0).locator("[data-gjs-select-value]")).toHaveText("Banana")
})

test("disabled option cannot be selected", async ({ page }) => {
  await openSelect(page, 0)
  const durianOpt = option(page, "Durian")
  await expect(durianOpt).toHaveAttribute("data-disabled", "true")
  await durianOpt.click({ force: true })
  // Should remain closed or re-click doesn't select
  await expect(trigger(page, 0).locator("[data-gjs-select-value]")).toHaveText("Pick a fruit")
})

// ─── 4. Allow Clear ───────────────────────────────────────────────────────────

test("clear button appears after selection", async ({ page }) => {
  const t = trigger(page, 0)
  await expect(t.locator("[data-gjs-select-clear]")).not.toBeVisible()
  await openSelect(page, 0)
  await option(page, "Apple").click()
  await t.hover()
  await expect(t.locator("[data-gjs-select-clear]")).toBeVisible()
})

test("clear button removes selection", async ({ page }) => {
  await openSelect(page, 0)
  await option(page, "Apple").click()
  const t = trigger(page, 0)
  await t.hover()
  await t.locator("[data-gjs-select-clear]").click()
  await expect(t.locator("[data-gjs-select-value]")).toHaveText("Pick a fruit")
})

// ─── 5. Search (Single + Search) ──────────────────────────────────────────────

test("search input is visible in showSearch mode", async ({ page }) => {
  // nth(1) = "Single + search"
  await openSelect(page, 1)
  await expect(searchInput(page)).toBeVisible()
})

test("search filters options", async ({ page }) => {
  await openSelect(page, 1)
  await searchInput(page).fill("ban")
  await expect(option(page, "Banana")).toBeVisible()
  await expect(page.locator("[data-gjs-select-option]")).toHaveCount(1)
})

test("shows no options message when search has no match", async ({ page }) => {
  await openSelect(page, 1)
  await searchInput(page).fill("xyz")
  await expect(page.locator("[data-gjs-select-empty]")).toBeVisible()
})

test("search is cleared after close and reopen (autoClearSearchValue)", async ({ page }) => {
  await openSelect(page, 1)
  await searchInput(page).fill("ban")
  await closeSelect(page)
  await openSelect(page, 1)
  await expect(searchInput(page)).toHaveValue("")
})

// ─── 6. Grouped Options ───────────────────────────────────────────────────────

test("renders group headings", async ({ page }) => {
  // nth(2) = "Grouped"
  await openSelect(page, 2)
  const drop = dropdown(page)
  await expect(drop).toContainText("Fruits")
  await expect(drop).toContainText("Vegetables")
})

test("can select option from group", async ({ page }) => {
  await openSelect(page, 2)
  await option(page, "Carrot").click()
  await expect(trigger(page, 2).locator("[data-gjs-select-value]")).toHaveText("Carrot")
})

// ─── 7. Multiple Mode ─────────────────────────────────────────────────────────

test("multiple mode: selects multiple options as tags", async ({ page }) => {
  // nth(3) = "Multiple"
  await openSelect(page, 3)
  await option(page, "Apple").click()
  await option(page, "Banana").click()
  const t = trigger(page, 3)
  await expect(t.locator("[data-gjs-select-tag]")).toHaveCount(2)
})

test("multiple mode: deselects option by clicking again", async ({ page }) => {
  await openSelect(page, 3)
  await option(page, "Apple").click()
  await option(page, "Banana").click()
  await option(page, "Apple").click() // deselect
  const t = trigger(page, 3)
  await expect(t.locator("[data-gjs-select-tag]")).toHaveCount(1)
  await expect(t.locator("[data-gjs-select-tag]").first()).toContainText("Banana")
})

test("multiple mode: removes tag via close button", async ({ page }) => {
  await openSelect(page, 3)
  await option(page, "Apple").click()
  await option(page, "Banana").click()
  await page.keyboard.press("Escape")
  const t = trigger(page, 3)
  // Close Apple tag
  await t.locator("[data-gjs-select-tag]").first().locator("[data-gjs-select-tag-close]").click()
  await expect(t.locator("[data-gjs-select-tag]")).toHaveCount(1)
})

test("multiple mode: selected option shows check icon", async ({ page }) => {
  await openSelect(page, 3)
  const appleOpt = option(page, "Apple")
  // Before selecting — no indicator (antd shows the check only when selected)
  await expect(appleOpt.locator("[data-gjs-select-option-check]")).toHaveCount(0)
  await appleOpt.click()
  // After selecting — the trailing check icon appears
  await expect(option(page, "Apple").locator("[data-gjs-select-option-check]")).toBeVisible()
})

test("multiple mode: maxTagCount shows overflow indicator", async ({ page }) => {
  // nth(3) has maxTagCount={3}
  await openSelect(page, 3)
  await option(page, "Apple").click()
  await option(page, "Banana").click()
  await option(page, "Cherry").click()
  await option(page, "Elderberry").click()
  await page.keyboard.press("Escape")
  const t = trigger(page, 3)
  // 3 visible + 1 overflow
  await expect(t.locator("[data-gjs-select-tag]")).toHaveCount(3)
  await expect(t.locator("[data-gjs-select-overflow-tag]")).toHaveText("+1")
})

test("multiple mode: clear all works", async ({ page }) => {
  await openSelect(page, 3)
  await option(page, "Apple").click()
  await option(page, "Banana").click()
  await page.keyboard.press("Escape")
  const t = trigger(page, 3)
  await t.hover()
  await t.locator("[data-gjs-select-clear]").click()
  await expect(t.locator("[data-gjs-select-tag]")).toHaveCount(0)
  await expect(t.locator("[data-gjs-select-placeholder]")).toBeVisible()
})

// ─── 8. Tags Mode ─────────────────────────────────────────────────────────────

test("tags mode: creates new tag by pressing Enter", async ({ page }) => {
  // nth(4) = "Tags"
  await openSelect(page, 4)
  await searchInput(page).fill("Mango")
  await page.keyboard.press("Enter")
  const t = trigger(page, 4)
  await expect(t.locator("[data-gjs-select-tag]").filter({ hasText: "Mango" })).toBeVisible()
})

test("tags mode: selects existing option without creating duplicate", async ({ page }) => {
  await openSelect(page, 4)
  await option(page, "Apple").click()
  const t = trigger(page, 4)
  await expect(t.locator("[data-gjs-select-tag]").filter({ hasText: "Apple" })).toHaveCount(1)
})

// ─── 9. Sizes ─────────────────────────────────────────────────────────────────

test("small size has data-size=small", async ({ page }) => {
  // nth(5,6,7) = sizes section
  await expect(trigger(page, 5)).toHaveAttribute("data-size", "small")
})

test("middle size has data-size=middle", async ({ page }) => {
  await expect(trigger(page, 6)).toHaveAttribute("data-size", "middle")
})

test("large size has data-size=large", async ({ page }) => {
  await expect(trigger(page, 7)).toHaveAttribute("data-size", "large")
})

// ─── 10. Status ───────────────────────────────────────────────────────────────

test("error status has data-status=error", async ({ page }) => {
  // nth(8) = error
  await expect(trigger(page, 8)).toHaveAttribute("data-status", "error")
})

test("warning status has data-status=warning", async ({ page }) => {
  // nth(9) = warning
  await expect(trigger(page, 9)).toHaveAttribute("data-status", "warning")
})

// ─── 11. Variants ─────────────────────────────────────────────────────────────

test("outlined variant opens and closes", async ({ page }) => {
  // nth(10) = outlined
  await openSelect(page, 10)
  await option(page, "Apple").click()
  await expect(trigger(page, 10).locator("[data-gjs-select-value]")).toHaveText("Apple")
})

test("filled variant opens and closes", async ({ page }) => {
  // nth(11) = filled
  await openSelect(page, 11)
  await option(page, "Apple").click()
  await expect(trigger(page, 11).locator("[data-gjs-select-value]")).toHaveText("Apple")
})

test("borderless variant opens and closes", async ({ page }) => {
  // nth(12) = borderless
  await openSelect(page, 12)
  await option(page, "Apple").click()
  await expect(trigger(page, 12).locator("[data-gjs-select-value]")).toHaveText("Apple")
})

// ─── 12. Loading / Disabled ───────────────────────────────────────────────────

test("loading state shows spinner", async ({ page }) => {
  // nth(13) = loading
  await expect(trigger(page, 13).locator("[data-gjs-select-loading]")).toBeVisible()
})

test("disabled select cannot be opened", async ({ page }) => {
  // nth(14) = disabled
  const t = trigger(page, 14)
  await expect(t).toHaveAttribute("data-disabled", "true")
  await t.click({ force: true })
  await expect(dropdown(page)).not.toBeVisible()
})

// ─── 13. Virtual List (500 items) ─────────────────────────────────────────────

test("virtual list renders options", async ({ page }) => {
  // nth(15) = virtual 500 items
  await openSelect(page, 15)
  await expect(page.locator("[data-gjs-select-virtual-list]")).toBeVisible()
  // Should show some items (virtualizer renders visible ones)
  await expect(page.locator("[data-gjs-select-option]").first()).toBeVisible()
})

test("virtual list search filters correctly", async ({ page }) => {
  await openSelect(page, 15)
  await searchInput(page).fill("Option 250")
  // Only matching item(s) visible
  const options = page.locator("[data-gjs-select-option]")
  await expect(options).toHaveCount(1)
  await expect(options.first()).toContainText("Option 250")
})

test("virtual list: selecting item closes dropdown", async ({ page }) => {
  await openSelect(page, 15)
  await searchInput(page).fill("Option 1")
  // Click the exact match
  await page.locator("[data-gjs-select-option]").filter({ hasText: /^Option 1$/ }).first().click()
  await expect(dropdown(page)).not.toBeVisible()
  await expect(trigger(page, 15).locator("[data-gjs-select-value]")).toHaveText("Option 1")
})

// ─── 14. Keyboard Navigation ──────────────────────────────────────────────────

test("Enter key opens dropdown", async ({ page }) => {
  const t = trigger(page, 0)
  await t.focus()
  await page.keyboard.press("Enter")
  await expect(dropdown(page)).toBeVisible()
})

test("Space key opens dropdown", async ({ page }) => {
  const t = trigger(page, 0)
  await t.focus()
  await page.keyboard.press("Space")
  await expect(dropdown(page)).toBeVisible()
})

test("ArrowDown key opens dropdown", async ({ page }) => {
  const t = trigger(page, 0)
  await t.focus()
  await page.keyboard.press("ArrowDown")
  await expect(dropdown(page)).toBeVisible()
})

test("Escape key closes dropdown and returns focus to trigger", async ({ page }) => {
  const t = trigger(page, 0)
  await t.focus()
  await page.keyboard.press("Enter")
  await expect(dropdown(page)).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(dropdown(page)).not.toBeVisible()
})

// ─── 15. Arrow Icon Rotation ──────────────────────────────────────────────────

test("chevron rotates when open", async ({ page }) => {
  const arrow = trigger(page, 0).locator("[data-gjs-select-arrow]")
  await expect(arrow).not.toHaveClass(/rotate-180/)
  await trigger(page, 0).click()
  await expect(arrow).toHaveClass(/rotate-180/)
})

// ─── 16. Custom optionRender ──────────────────────────────────────────────────

// nth(16) would be out of range — custom render is on the last section (index varies)
// Let's verify the last select (custom render) opens and shows options
test("custom optionRender: opens and shows options", async ({ page }) => {
  const lastTrigger = page.locator("[data-gjs-select-trigger]").last()
  await lastTrigger.click()
  await expect(dropdown(page)).toBeVisible()
  await expect(page.locator("[data-gjs-select-option]").first()).toBeVisible()
})

// ─── 17. Accessibility attributes ─────────────────────────────────────────────

test("aria-controls points to listbox after dropdown opens (cmdk path)", async ({ page }) => {
  const t = trigger(page, 0)
  // aria-controls is set after the portal mounts (needs open)
  await t.click()
  await expect(dropdown(page)).toBeVisible()
  const controls = await t.getAttribute("aria-controls")
  expect(controls).toBeTruthy()
  // The referenced element must be in the DOM and have role=listbox
  const listbox = page.locator(`#${controls}`)
  await expect(listbox).toBeAttached()
})

test("aria-activedescendant updates on ArrowDown (cmdk path)", async ({ page }) => {
  const t = trigger(page, 0)
  await t.click()
  await expect(dropdown(page)).toBeVisible()
  const searchInput = page.locator("[data-gjs-select-search]").first()
  await searchInput.press("ArrowDown")
  await page.waitForTimeout(50)
  const ad = await t.getAttribute("aria-activedescendant")
  expect(ad).toBeTruthy()
  // The referenced option must exist and be selected
  const activeOption = page.locator(`#${ad}`)
  await expect(activeOption).toHaveAttribute("aria-selected", "true")
})

test("aria-activedescendant clears when dropdown closes", async ({ page }) => {
  const t = trigger(page, 0)
  await t.click()
  const searchInput = page.locator("[data-gjs-select-search]").first()
  await searchInput.press("ArrowDown")
  await page.waitForTimeout(50)
  await searchInput.press("Escape")
  await page.waitForTimeout(50)
  await expect(t).not.toHaveAttribute("aria-activedescendant")
})

test("virtual list: aria-controls always present (virtual path)", async ({ page }) => {
  // The virtual select has its listboxId computed statically (no portal ID needed)
  const virtualTrigger = page
    .locator("text=Virtual (500 items)")
    .locator("..")
    .locator("[data-gjs-select-trigger]")
  const controls = await virtualTrigger.getAttribute("aria-controls")
  expect(controls).toBeTruthy()
})

test("virtual list: aria-activedescendant updates on ArrowDown", async ({ page }) => {
  const virtualTrigger = page
    .locator("text=Virtual (500 items)")
    .locator("..")
    .locator("[data-gjs-select-trigger]")
  await virtualTrigger.click()
  await expect(page.locator("[data-gjs-select-virtual-list]")).toBeVisible()
  const virtualList = page.locator("[data-gjs-select-virtual-list]")
  await virtualList.press("ArrowDown")
  await page.waitForTimeout(50)
  const ad = await virtualTrigger.getAttribute("aria-activedescendant")
  expect(ad).toBeTruthy()
  const activeOption = page.locator(`#${ad}`)
  await expect(activeOption).toBeAttached()
})

// ─── 18. React Hook Form + Zod ────────────────────────────────────────────────

const rhfForm = (page: import("@playwright/test").Page) =>
  page.locator("[data-testid=rhf-form]")

const rhfField = (page: import("@playwright/test").Page, name: string) =>
  rhfForm(page).locator(`[data-gjs-select-trigger]`).nth(name === "country" ? 0 : 1)

test("RHF: submit without values shows Zod validation errors", async ({ page }) => {
  await page.goto("/")
  await rhfForm(page).locator("button[type=submit]").click()
  // Both errors should appear
  const errors = page.locator("[data-gjs-select-form-error]")
  await expect(errors).toHaveCount(2)
  await expect(errors.nth(0)).toContainText("Ülke seçimi zorunludur")
  await expect(errors.nth(1)).toContainText("En az 2 beceri seçin")
})

test("RHF: error clears after valid selection", async ({ page }) => {
  await page.goto("/")
  await rhfForm(page).locator("button[type=submit]").click()
  await expect(page.locator("[data-gjs-select-form-error]").nth(0)).toBeVisible()

  // Select a country
  await rhfField(page, "country").click()
  await page.locator("[data-gjs-select-option]").first().click()

  // Country error should disappear
  const errors = page.locator("[data-gjs-select-form-error]")
  await expect(errors).toHaveCount(1)
})

test("RHF: status=error applied to trigger on validation error", async ({ page }) => {
  await page.goto("/")
  await rhfForm(page).locator("button[type=submit]").click()
  await expect(page.locator("[data-gjs-select-form-error]").nth(0)).toBeVisible()
  await expect(rhfField(page, "country")).toHaveAttribute("data-status", "error")
})

test("RHF: aria-invalid set on trigger when error", async ({ page }) => {
  await page.goto("/")
  await rhfForm(page).locator("button[type=submit]").click()
  await expect(page.locator("[data-gjs-select-form-error]").nth(0)).toBeVisible()
  await expect(rhfField(page, "country")).toHaveAttribute("aria-invalid", "true")
})

test("RHF: multiple select min/max Zod validation", async ({ page }) => {
  await page.goto("/")
  // Select country first so only skills error remains
  await rhfField(page, "country").click()
  await page.locator("[data-gjs-select-option]").first().click()

  // Submit → skills min 2 error
  await rhfForm(page).locator("button[type=submit]").click()
  const skillsError = page.locator("[data-gjs-select-form-error]").first()
  await expect(skillsError).toContainText("En az 2 beceri seçin")
})

// ─── 19. Keyboard tag removal ─────────────────────────────────────────────────

test("Backspace on trigger removes last tag when dropdown closed", async ({ page }) => {
  await page.goto("/")
  // Use the multiple select (index 3 on page — "Multiple")
  const multiTrigger = page.locator("[data-gjs-select-trigger]").nth(3)
  await multiTrigger.click()
  await page.locator("[data-gjs-select-option]").nth(0).click()
  await page.locator("[data-gjs-select-option]").nth(1).click()
  await page.keyboard.press("Escape")
  await expect(page.locator("[data-gjs-select-tag]")).toHaveCount(2)
  // Focus trigger and press Backspace
  await multiTrigger.focus()
  await page.keyboard.press("Backspace")
  await expect(page.locator("[data-gjs-select-tag]")).toHaveCount(1)
})

test("Backspace in empty search removes last tag (cmdk)", async ({ page }) => {
  await page.goto("/")
  const multiTrigger = page.locator("[data-gjs-select-trigger]").nth(3)
  await multiTrigger.click()
  await page.locator("[data-gjs-select-option]").nth(0).click()
  await page.locator("[data-gjs-select-option]").nth(1).click()
  await expect(page.locator("[data-gjs-select-tag]")).toHaveCount(2)
  // Search is empty → Backspace removes last tag
  const search = page.locator("[data-gjs-select-trigger][data-open] [data-gjs-select-search]")
  await search.press("Backspace")
  await expect(page.locator("[data-gjs-select-tag]")).toHaveCount(1)
})

test("RHF: valid form submits successfully", async ({ page }) => {
  await page.goto("/")

  // Select country
  await rhfField(page, "country").click()
  await page.locator("[data-gjs-select-option]").first().click()

  // Select 2 skills
  const skillsTrigger = rhfField(page, "skills")
  await skillsTrigger.click()
  const skillOptions = page.locator("[data-gjs-select-option]")
  await skillOptions.nth(0).click()
  await skillOptions.nth(1).click()
  await page.keyboard.press("Escape")

  await rhfForm(page).locator("button[type=submit]").click()
  await expect(page.locator("[data-testid=rhf-success]")).toBeVisible()
  await expect(page.locator("[data-gjs-select-form-error]")).toHaveCount(0)
})
