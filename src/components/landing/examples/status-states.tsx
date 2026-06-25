"use client"

import { Select } from "@/components/ui/select"

const PLANS = [
  { label: "Hobby", value: "hobby" },
  { label: "Pro", value: "pro" },
  { label: "Team", value: "team" },
  { label: "Enterprise", value: "enterprise" },
]

export function StatusStates() {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <p className="font-mono text-xs text-muted-foreground">status=&quot;error&quot;</p>
        <Select
          options={PLANS}
          status="error"
          allowClear
          placeholder="Selection required"
          aria-label="Select in error state"
        />
      </div>
      <div className="space-y-1">
        <p className="font-mono text-xs text-muted-foreground">status=&quot;warning&quot;</p>
        <Select
          options={PLANS}
          status="warning"
          defaultValue="hobby"
          allowClear
          aria-label="Select in warning state"
        />
      </div>
    </div>
  )
}
