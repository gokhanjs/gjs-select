import { type Page, expect, test } from "@playwright/test"

// Thresholds (ms)
const T = {
  OPEN: 300,           // trigger click → dropdown visible
  CLOSE: 200,          // Escape → dropdown hidden
  SEARCH: 200,         // type char → filtered results appear
  FIRST_ITEM_VISIBLE: 1000, // first virtual row renders
  SELECT: 600,         // click option → dropdown closes (includes Radix Popover exit animation)
}

// Matches both virtual path (<input data-gjs-select-search>) and cmdk path (<input cmdk-input>)
const SEARCH_INPUT = '[data-gjs-select-search], [cmdk-input]'

async function measureMs(fn: () => Promise<void>): Promise<number> {
  const start = Date.now()
  await fn()
  return Date.now() - start
}

async function goToTestPage(page: Page, n: number) {
  await page.goto(`/test?n=${n}`)
  await page.waitForSelector('[data-testid="option-count"]')
}

// ─── 1k options ──────────────────────────────────────────────────────────────

test.describe("Performance — 1 000 options", () => {
  test.beforeEach(async ({ page }) => {
    await goToTestPage(page, 1000)
  })

  test("dropdown opens within threshold", async ({ page }) => {
    const trigger = page.getByTestId("perf-select")
    const elapsed = await measureMs(async () => {
      await trigger.click()
      await page.waitForSelector('[role="listbox"], [cmdk-list]', { timeout: T.OPEN })
    })
    expect(elapsed, `open took ${elapsed}ms, limit ${T.OPEN}ms`).toBeLessThan(T.OPEN)
  })

  test("dropdown closes within threshold", async ({ page }) => {
    await page.getByTestId("perf-select").click()
    await page.waitForSelector('[role="listbox"], [cmdk-list]')

    const elapsed = await measureMs(async () => {
      await page.keyboard.press("Escape")
      await page.waitForSelector('[role="listbox"], [cmdk-list]', { state: "hidden", timeout: T.CLOSE })
    })
    expect(elapsed, `close took ${elapsed}ms, limit ${T.CLOSE}ms`).toBeLessThan(T.CLOSE)
  })

  test("search filters within threshold", async ({ page }) => {
    await page.getByTestId("perf-select").click()
    await page.waitForSelector('[role="listbox"], [cmdk-list]')

    const input = page.locator(SEARCH_INPUT).first()
    await input.click()

    const elapsed = await measureMs(async () => {
      await input.fill("Option 500")
      await page.waitForFunction(
        () => {
          const items = document.querySelectorAll('[data-gjs-select-item], [cmdk-item]')
          return items.length < 10
        },
        { timeout: T.SEARCH }
      )
    })
    expect(elapsed, `search took ${elapsed}ms, limit ${T.SEARCH}ms`).toBeLessThan(T.SEARCH)
  })

  test("selecting an option closes dropdown within threshold", async ({ page }) => {
    await page.getByTestId("perf-select").click()
    await page.waitForSelector('[role="listbox"], [cmdk-list]')

    const firstItem = page
      .locator('[data-gjs-select-option]:not([data-disabled])')
      .first()

    const elapsed = await measureMs(async () => {
      await firstItem.click()
      await page.waitForSelector('[role="listbox"], [cmdk-list]', { state: "hidden", timeout: T.SELECT })
    })
    expect(elapsed, `select took ${elapsed}ms, limit ${T.SELECT}ms`).toBeLessThan(T.SELECT)
  })
})

// ─── 5k options ──────────────────────────────────────────────────────────────

test.describe("Performance — 5 000 options", () => {
  const LIMITS = { OPEN: 500, SEARCH: 300 }

  test.beforeEach(async ({ page }) => {
    await goToTestPage(page, 5000)
  })

  test("dropdown opens within threshold", async ({ page }) => {
    const elapsed = await measureMs(async () => {
      await page.getByTestId("perf-select").click()
      await page.waitForSelector('[role="listbox"], [cmdk-list]', { timeout: LIMITS.OPEN })
    })
    expect(elapsed).toBeLessThan(LIMITS.OPEN)
  })

  test("search filters within threshold", async ({ page }) => {
    await page.getByTestId("perf-select").click()
    await page.waitForSelector('[role="listbox"], [cmdk-list]')

    const input = page.locator(SEARCH_INPUT).first()
    await input.click()

    const elapsed = await measureMs(async () => {
      await input.fill("Option 2500")
      await page.waitForFunction(
        () => document.querySelectorAll('[data-gjs-select-item], [cmdk-item]').length < 20,
        { timeout: LIMITS.SEARCH }
      )
    })
    expect(elapsed).toBeLessThan(LIMITS.SEARCH)
  })
})

// ─── 10k options ─────────────────────────────────────────────────────────────

test.describe("Performance — 10 000 options", () => {
  const LIMITS = { OPEN: 1000, SEARCH: 400, FIRST_ITEM: T.FIRST_ITEM_VISIBLE }

  test.beforeEach(async ({ page }) => {
    await goToTestPage(page, 10000)
  })

  test("dropdown opens within threshold", async ({ page }) => {
    const elapsed = await measureMs(async () => {
      await page.getByTestId("perf-select").click()
      await page.waitForSelector('[role="listbox"], [cmdk-list]', { timeout: LIMITS.OPEN })
    })
    expect(elapsed).toBeLessThan(LIMITS.OPEN)
  })

  test("first item visible within threshold", async ({ page }) => {
    const elapsed = await measureMs(async () => {
      await page.getByTestId("perf-select").click()
      await page
        .locator('[data-gjs-select-option]:not([data-disabled])')
        .first()
        .waitFor({ timeout: LIMITS.FIRST_ITEM })
    })
    expect(elapsed).toBeLessThan(LIMITS.FIRST_ITEM)
  })

  test("search filters within threshold", async ({ page }) => {
    await page.getByTestId("perf-select").click()
    await page.waitForSelector('[role="listbox"], [cmdk-list]')

    const input = page.locator(SEARCH_INPUT).first()
    await input.click()

    const elapsed = await measureMs(async () => {
      await input.fill("Option 9999")
      await page.waitForFunction(
        () => document.querySelectorAll('[data-gjs-select-item], [cmdk-item]').length < 5,
        { timeout: LIMITS.SEARCH }
      )
    })
    expect(elapsed).toBeLessThan(LIMITS.SEARCH)
  })

  test("JS heap does not exceed 150 MB after open", async ({ page, context }) => {
    await page.getByTestId("perf-select").click()
    await page.waitForSelector('[role="listbox"], [cmdk-list]')

    const client = await context.newCDPSession(page)
    const { result } = await client.send("Runtime.evaluate", {
      expression: "performance.memory ? performance.memory.usedJSHeapSize : 0",
      returnByValue: true,
    })
    const heapMB = (result.value as number) / 1024 / 1024
    expect(heapMB, `heap ${heapMB.toFixed(1)} MB exceeds 150 MB`).toBeLessThan(150)
  })
})

// ─── Rendering consistency ────────────────────────────────────────────────────

test.describe("Performance — rendering consistency", () => {
  test("DOM node count stays bounded with virtual list (10k options)", async ({ page, context }) => {
    await goToTestPage(page, 10000)
    await page.getByTestId("perf-select").click()
    await page.waitForSelector('[role="listbox"], [cmdk-list]')

    const client = await context.newCDPSession(page)
    const metrics = await client.send("Performance.getMetrics")
    const domNodes = metrics.metrics.find((m) => m.name === "Nodes")?.value ?? 0

    // Virtual list should render only visible rows — expect < 500 DOM nodes total
    expect(domNodes, `${domNodes} DOM nodes — virtual list may be broken`).toBeLessThan(500)
  })
})
