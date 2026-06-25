"use client"

import * as React from "react"

import { Select } from "@/components/ui/select"
import { ExampleCard } from "./example-card"

const RUNTIMES = [
  { label: "Node.js", value: "node" },
  { label: "Bun", value: "bun" },
  { label: "Deno", value: "deno" },
  { label: "Edge", value: "edge" },
]

export function ClientSelectCard() {
  const [value, setValue] = React.useState<string | null>("bun")
  // false during SSR, true once hydrated in the browser — useSyncExternalStore
  // reads a different snapshot on the server than on the client, no effect needed.
  const hydrated = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  return (
    <ExampleCard
      badge="Client Component"
      tone="client"
      marker={hydrated ? "Hydrated in your browser" : "Server HTML (pre-hydration)"}
      detail={`'use client' with live state — selected: ${value ?? "—"}.`}
    >
      <Select
        options={RUNTIMES}
        value={value}
        onChange={(v) => setValue(v as string | null)}
        aria-label="Client component select"
      />
    </ExampleCard>
  )
}
