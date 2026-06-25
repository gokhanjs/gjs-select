"use client"

import * as React from "react"

import { Select, type SelectOption } from "@/components/ui/gjs-select"

const COUNT = 10_000
// Format with a fixed locale so the server (en-US) and the client (any locale)
// produce identical text. A bare toLocaleString() formats in the visitor's
// locale, which mismatches the server-rendered HTML ("10,000" vs "10.000") and
// triggers a hydration error.
const COUNT_LABEL = COUNT.toLocaleString("en-US")

// 10,000 options generated once. The dropdown only mounts the rows in view
// (@tanstack/react-virtual), so opening and scrolling stays smooth.
export function VirtualList() {
  const options = React.useMemo<SelectOption[]>(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: String(i + 1),
      })),
    [],
  )
  const [value, setValue] = React.useState<string[]>([])

  return (
    <div className="space-y-2">
      <Select
        mode="multiple"
        virtual
        options={options}
        value={value}
        onChange={(v) => setValue((v as string[]) ?? [])}
        showSearch
        allowClear
        maxTagCount="responsive"
        placeholder={`Search ${COUNT_LABEL} options…`}
        aria-label="Virtualized option list"
      />
      <p className="text-xs text-muted-foreground">
        {COUNT_LABEL} options, only the visible rows rendered.
      </p>
    </div>
  )
}
