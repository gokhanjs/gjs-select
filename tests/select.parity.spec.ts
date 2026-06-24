import { test, expect, type Page, type Locator } from "@playwright/test"

// ─── Parity harness: custom (gjs) Select vs antd v6 Select ────────────────────
//
// Strategy: antd is the ORACLE. For each metric we hard-assert antd's real
// behaviour (validates the measurement), then soft-assert that the custom
// implementation matches. Soft failures do NOT abort the run, so a single
// `pnpm test:parity` lists every divergence at once — that list is the Phase
// 2-4 worklist. A green run means full behavioural + dimensional parity.
//
// NOTE: antd v6 refactored its semantic DOM. The control's inner box is
// `.ant-select-content` (was `.ant-select-selector`), the combobox input is
// `.ant-select-input`, and visible options are `.ant-select-item-option`
// inside `.rc-virtual-list` (a separate hidden `[role=option]` a11y mirror
// also exists — do not target it).

const TOL = 2 // px tolerance

// antd v6 dimensional spec — derived from @rc-component/select + antd seed
// tokens (authoritative). Live antd renders control + tag heights correctly
// under AntdRegistry, but the portaled dropdown option under-renders its
// min-height in this harness, so option dims use the documented constants.
//   controlHeight 32 / SM 24 / LG 40
//   optionHeight = controlHeight = 32
//   optionPadding = (controlHeight - fontSize*lineHeight)/2 = 5px , controlPaddingHorizontal = 12px
//   multipleItemHeight = min(32-2*paddingXXS, 32-2*lineWidth) = 24
const ANTD_SPEC = {
  control: { "size-small": 24, "size-middle": 32, "size-large": 40 } as Record<string, number>,
  optionHeight: 32,
  optionPadLeft: 12,
  tagHeight: 24,
}

function antdRoot(page: Page, id: string): Locator {
  return page.locator(`[data-case="${id}"] [data-impl="antd"] .ant-select`)
}
function antdContent(page: Page, id: string): Locator {
  return page.locator(`[data-case="${id}"] [data-impl="antd"] .ant-select-content`)
}
function antdDropdown(page: Page, id: string): Locator {
  return page.locator(`.antd-pop-${id}`)
}
function antdOption(page: Page, id: string): Locator {
  return antdDropdown(page, id).locator(".ant-select-item-option")
}
function gjsTrigger(page: Page, id: string): Locator {
  return page.locator(`[data-case="${id}"] [data-impl="gjs"] [data-gjs-select-trigger]`)
}
function gjsDropdown(page: Page, id: string): Locator {
  return page.locator(`.gjs-pop-${id}`)
}
function gjsOption(page: Page, id: string): Locator {
  return gjsDropdown(page, id).locator("[data-gjs-select-option]")
}

async function box(loc: Locator) {
  return (await loc.boundingBox()) ?? { width: -1, height: -1, x: -1, y: -1 }
}
async function openAntd(page: Page, id: string) {
  await antdContent(page, id).click()
  await expect(antdOption(page, id).first()).toBeVisible()
}
async function openGjs(page: Page, id: string) {
  await gjsTrigger(page, id).click()
  await expect(gjsDropdown(page, id)).toBeVisible()
}
function pad(loc: Locator) {
  return loc.evaluate((el) => {
    const s = getComputedStyle(el)
    return { top: parseFloat(s.paddingTop), left: parseFloat(s.paddingLeft) }
  })
}

test.beforeEach(async ({ page }) => {
  await page.goto("/parity")
  await expect(antdRoot(page, "size-middle")).toBeVisible()
})

// ─── 1. Control height per size ───────────────────────────────────────────────

const SIZE_ORACLE: Record<string, number> = {
  "size-small": 24,
  "size-middle": 32,
  "size-large": 40,
}

for (const [id, expected] of Object.entries(SIZE_ORACLE)) {
  test(`control height — ${id}`, async ({ page }) => {
    const antdH = (await box(antdRoot(page, id))).height
    const gjsH = (await box(gjsTrigger(page, id))).height

    expect(Math.abs(antdH - expected), `antd ${id} height ${antdH} ≈ ${expected}`).toBeLessThanOrEqual(TOL)
    expect.soft(Math.abs(gjsH - antdH), `gjs ${id} height ${gjsH} vs antd ${antdH}`).toBeLessThanOrEqual(TOL)
    console.log(`[control-height] ${id}: antd=${antdH} gjs=${gjsH}`)
  })
}

// ─── 2. Dropdown option row height + padding ──────────────────────────────────

test("option row height + padding — single", async ({ page }) => {
  await openAntd(page, "single")
  const antdOpt = antdOption(page, "single").first()
  const antdH = (await box(antdOpt)).height // live antd (under-renders here; for reference)
  const antdPad = await pad(antdOpt)

  await openGjs(page, "single")
  const gjsOpt = gjsOption(page, "single").first()
  const gjsH = (await box(gjsOpt)).height
  const gjsPad = await pad(gjsOpt)

  // Oracle = antd token spec (32 / pad-left 12).
  expect.soft(Math.abs(gjsH - ANTD_SPEC.optionHeight), `gjs option height ${gjsH} vs spec ${ANTD_SPEC.optionHeight}`).toBeLessThanOrEqual(TOL + 2)
  expect.soft(Math.abs(gjsPad.left - ANTD_SPEC.optionPadLeft), `gjs option padding-left ${gjsPad.left} vs spec ${ANTD_SPEC.optionPadLeft}`).toBeLessThanOrEqual(TOL)
  console.log(`[option-metrics] single: SPEC h=${ANTD_SPEC.optionHeight} padL=${ANTD_SPEC.optionPadLeft} | gjs h=${gjsH} padL=${gjsPad.left} | antd-live h=${antdH.toFixed(1)} padL=${antdPad.left}`)
})

// ─── 3. defaultActiveFirstOption ──────────────────────────────────────────────

test("defaultActiveFirstOption — first option active on open", async ({ page }) => {
  await openAntd(page, "single")
  const antdActive = await antdOption(page, "single")
    .first()
    .evaluate((el) => el.classList.contains("ant-select-item-option-active"))

  await openGjs(page, "single")
  const gjsActive = await gjsOption(page, "single")
    .first()
    .evaluate((el) => el.hasAttribute("data-active") || el.getAttribute("aria-selected") === "true")

  expect(antdActive, "antd highlights first option").toBe(true)
  expect.soft(gjsActive, "gjs should highlight first option").toBe(true)
  console.log(`[active-first] antd=${antdActive} gjs=${gjsActive}`)
})

// ─── 4. Inline search lives in the control, not the dropdown ──────────────────

test("search input is inside the control (selector), not the dropdown", async ({ page }) => {
  // antd: the combobox input is a child of .ant-select (the control box).
  const antdInputInControl = await antdRoot(page, "single-search").locator(".ant-select-input").count()
  expect(antdInputInControl, "antd search input is inside the control").toBeGreaterThan(0)

  await openGjs(page, "single-search")
  const gjsInputInControl = await gjsTrigger(page, "single-search").locator("input,[data-gjs-select-search]").count()
  const gjsInputInDropdown = await gjsDropdown(page, "single-search").locator("[data-gjs-select-search]").count()

  expect.soft(gjsInputInControl, "gjs search input should be inside the control like antd").toBeGreaterThan(0)
  console.log(`[inline-search] antd-in-control=${antdInputInControl} gjs-in-control=${gjsInputInControl} gjs-in-dropdown=${gjsInputInDropdown}`)
})

// ─── 5. Multiple-mode selected indicator: check icon, not a bordered checkbox ─

test("multiple selected indicator matches antd (check icon, no bordered box)", async ({ page }) => {
  await openAntd(page, "multiple")
  const antdSelected = await antdDropdown(page, "multiple").locator(".ant-select-item-option-selected").count()
  expect(antdSelected, "antd marks selected options").toBeGreaterThan(0)

  await openGjs(page, "multiple")
  const gjsCheck = gjsOption(page, "multiple").first().locator("[data-gjs-select-option-check]")
  const gjsBorder = await gjsCheck
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).borderTopWidth) || 0)
    .catch(() => -1)

  expect.soft(gjsBorder, `gjs check border ${gjsBorder}px should be 0 (antd uses a borderless check icon)`).toBe(0)
  console.log(`[multi-indicator] antd-selected=${antdSelected} gjs-check-border=${gjsBorder}px`)
})

// ─── 6. tokenSeparators (tags mode) ───────────────────────────────────────────

test("tokenSeparators splits typed input into multiple tags", async ({ page }) => {
  await antdContent(page, "tags").click()
  const antdInput = antdRoot(page, "tags").locator(".ant-select-input")
  await antdInput.fill("x,y,z")
  await antdInput.press(",")
  const antdTags = await antdRoot(page, "tags").locator(".ant-select-selection-item").count()
  expect(antdTags, `antd created ${antdTags} tags from "x,y,z,"`).toBeGreaterThanOrEqual(3)

  await openGjs(page, "tags")
  // The gjs search input now lives in the selector (trigger), antd-style.
  const gjsInput = gjsTrigger(page, "tags").locator("[data-gjs-select-search]")
  await gjsInput.fill("x,y,z")
  await gjsInput.press(",")
  const gjsTags = await gjsTrigger(page, "tags").locator("[data-gjs-select-tag]").count()

  expect.soft(gjsTags, `gjs should create ≥3 tags from "x,y,z," (got ${gjsTags})`).toBeGreaterThanOrEqual(3)
  console.log(`[token-separators] antd-tags=${antdTags} gjs-tags=${gjsTags}`)
})

// ─── 7. Multiple-mode tag height ──────────────────────────────────────────────

test("multiple tag height matches antd", async ({ page }) => {
  const antdTag = (await box(antdRoot(page, "multiple").locator(".ant-select-selection-item").first())).height
  const gjsTag = (await box(gjsTrigger(page, "multiple").locator("[data-gjs-select-tag]").first())).height

  expect(antdTag, `antd tag height ${antdTag} > 0`).toBeGreaterThan(0)
  expect.soft(Math.abs(gjsTag - antdTag), `gjs tag height ${gjsTag} vs antd ${antdTag}`).toBeLessThanOrEqual(TOL + 2)
  console.log(`[tag-height] antd=${antdTag} gjs=${gjsTag}`)
})
