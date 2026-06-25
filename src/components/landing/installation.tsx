"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/landing/code-block"
import { SectionHeading } from "@/components/landing/section-heading"
import { site } from "@/lib/site"

const RUNNERS = {
  npm: `npx shadcn@latest add ${site.registry}`,
  pnpm: `pnpm dlx shadcn@latest add ${site.registry}`,
  yarn: `yarn dlx shadcn@latest add ${site.registry}`,
  bun: `bunx shadcn@latest add ${site.registry}`,
} as const

type Runner = keyof typeof RUNNERS

const USAGE_SNIPPET = `import { Select } from "@/components/ui/select"

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
]

export function Example() {
  return (
    <Select
      options={options}
      showSearch
      allowClear
      placeholder="Pick a fruit"
    />
  )
}`

export function Installation() {
  const [active, setActive] = useState<Runner>("npm")

  return (
    <section id="installation" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Get started"
          title="Installation"
          description="Add the component with the shadcn CLI — it drops select.tsx straight into your components/ui. No package to install, no styles to import. You own the code and edit it like any other file."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              1. Run the shadcn CLI
            </p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {(Object.keys(RUNNERS) as Runner[]).map((runner) => (
                <Button
                  key={runner}
                  size="sm"
                  variant={active === runner ? "secondary" : "ghost"}
                  onClick={() => setActive(runner)}
                >
                  {runner}
                </Button>
              ))}
            </div>
            <CodeBlock code={RUNNERS[active]} language="bash" filename="terminal" />
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              2. Use it
            </p>
            <CodeBlock code={USAGE_SNIPPET} filename="example.tsx" />
          </div>
        </div>
      </div>
    </section>
  )
}
