// Server Component (no "use client"). It renders the client <Select> island
// directly — the standard App Router composition — and pairs it with a client
// component so the two rendering modes sit side by side.

import { Select } from "@/components/ui/select"
import { ExampleCard } from "./example-card"
import { ClientSelectCard } from "./client-select-card"

const RUNTIMES = [
  { label: "Node.js", value: "node" },
  { label: "Bun", value: "bun" },
  { label: "Deno", value: "deno" },
  { label: "Edge", value: "edge" },
]

function ServerSelectCard() {
  // `process.version` only exists in a server runtime — its presence in the
  // output proves this subtree was rendered on the server, never in the browser.
  const marker = `Rendered on the server · Node ${process.version}`
  return (
    <ExampleCard
      badge="Server Component"
      tone="server"
      marker={marker}
      detail="No 'use client' here. Options are prepared on the server and the Select is shipped as a client island."
    >
      <Select
        options={RUNTIMES}
        defaultValue="node"
        aria-label="Server component select"
      />
    </ExampleCard>
  )
}

export function RenderModes() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ServerSelectCard />
      <ClientSelectCard />
    </div>
  )
}
