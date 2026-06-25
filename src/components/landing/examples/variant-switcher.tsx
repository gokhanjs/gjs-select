"use client"

import * as React from "react"

import { Select } from "@/components/ui/gjs-select"
import { cn } from "@/lib/utils"

const VARIANTS = ["outlined", "filled", "borderless"] as const
type Variant = (typeof VARIANTS)[number]

const STACKS = [
  { label: "Next.js", value: "next" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
  { label: "SvelteKit", value: "svelte" },
]

export function VariantSwitcher() {
  const [variant, setVariant] = React.useState<Variant>("outlined")

  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5">
        {VARIANTS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVariant(v)}
            aria-pressed={v === variant}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
              v === variant
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {v}
          </button>
        ))}
      </div>
      <Select
        variant={variant}
        options={STACKS}
        mode="multiple"
        defaultValue={["next", "remix"]}
        placeholder="Pick a stack"
        aria-label="Variant preview select"
      />
    </div>
  )
}
