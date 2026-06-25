"use client"

import { Select } from "@/components/ui/select"

const ROLES = [
  { label: "Senior Frontend Engineer", value: "fe" },
  { label: "Distributed Systems Architect", value: "arch" },
  { label: "Developer Experience Lead", value: "dx" },
  { label: "Machine Learning Researcher", value: "ml" },
  { label: "Site Reliability Engineer", value: "sre" },
]

export function ResponsiveTags() {
  return (
    <div className="space-y-2">
      {/* Drag the right edge: maxTagCount="responsive" measures how many tags fit
          (ResizeObserver) and collapses the overflow into a +N pill. */}
      <div className="w-64 min-w-40 max-w-full resize-x overflow-hidden rounded-md border border-dashed border-border p-2">
        <Select
          options={ROLES}
          mode="multiple"
          maxTagCount="responsive"
          defaultValue={["fe", "arch", "dx"]}
          placeholder="Pick roles"
          aria-label="Responsive tags select"
        />
      </div>
      <p className="text-xs text-muted-foreground">← Drag the dashed box wider or narrower →</p>
    </div>
  )
}
