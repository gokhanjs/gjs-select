"use client"

import { useEffect, useMemo, useState } from "react"
import { notFound } from "next/navigation"
import { Select } from "@/components/ui/gjs-select"

export default function TestPage() {
  // Test-only fixture: render in dev for Playwright, 404 on the public build.
  if (process.env.NODE_ENV === "production") notFound()

  const [count, setCount] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const n = Math.min(parseInt(params.get("n") ?? "1000"), 10000)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only query-param read; avoids SSR hydration mismatch
    setCount(n)
  }, [])

  const options = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `opt-${i + 1}`,
      })),
    [count]
  )

  if (count === 0) {
    return <div data-testid="loading">Loading...</div>
  }

  return (
    <main className="p-8 max-w-sm">
      <div data-testid="option-count" className="sr-only">
        {count}
      </div>
      <Select
        options={options}
        virtual
        showSearch
        placeholder={`Search ${count} items`}
        allowClear
        data-testid="perf-select"
        aria-label="Performance test selection"
      />
    </main>
  )
}
