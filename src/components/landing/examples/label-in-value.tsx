"use client"

import * as React from "react"

import { Select } from "@/components/ui/select"

const TOPICS = [
  { label: "TypeScript", value: "ts" },
  { label: "Accessibility", value: "a11y" },
  { label: "Performance", value: "perf" },
  { label: "Testing", value: "test" },
  { label: "Design systems", value: "ds" },
]

const MAX = 3

// labelInValue makes onChange emit { label, value } objects instead of bare
// values — handy when you persist the label without a second lookup. maxCount
// stops selection once MAX tags are picked.
export function LabelInValue() {
  const [picked, setPicked] = React.useState<unknown>([])

  return (
    <div className="space-y-3">
      <Select
        mode="multiple"
        labelInValue
        maxCount={MAX}
        options={TOPICS}
        onChange={(v) => setPicked(v)}
        maxTagCount="responsive"
        placeholder={`Pick up to ${MAX} topics`}
        aria-label="Label in value select"
      />
      <pre className="overflow-x-auto rounded-lg bg-muted/40 p-3 font-mono text-xs leading-5 text-muted-foreground">
        {JSON.stringify(picked, null, 2)}
      </pre>
    </div>
  )
}
