"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { CodeBlock } from "@/components/landing/code-block"
import { SectionHeading } from "@/components/landing/section-heading"

const MODES = ["single", "multiple", "tags"] as const
const SIZES = ["small", "middle", "large"] as const

type Mode = (typeof MODES)[number]
type Size = (typeof SIZES)[number]

const OPTIONS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Elderberry", value: "elderberry" },
]

function FieldLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  )
}

export function UsagePlayground() {
  const [mode, setMode] = useState<Mode>("multiple")
  const [size, setSize] = useState<Size>("middle")
  const [showSearch, setShowSearch] = useState(true)
  const [allowClear, setAllowClear] = useState(true)
  const [disabled, setDisabled] = useState(false)

  const propLines = [
    mode !== "single" && `mode="${mode}"`,
    size !== "middle" && `size="${size}"`,
    showSearch && "showSearch",
    allowClear && "allowClear",
    disabled && "disabled",
  ].filter(Boolean) as string[]

  const code = `<Select
  options={options}${propLines.length ? "\n" + propLines.map((p) => `  ${p}`).join("\n") : ""}
/>`

  return (
    <section id="usage" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Playground"
          title="Try it live"
          description="Tweak the props and copy the generated code straight into your project."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
            <div>
              <FieldLabel>Mode</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {MODES.map((m) => (
                  <Button
                    key={m}
                    size="sm"
                    variant={mode === m ? "secondary" : "ghost"}
                    onClick={() => setMode(m)}
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>Size</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={size === s ? "secondary" : "ghost"}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel>Options</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  size="sm"
                  variant={showSearch ? "secondary" : "ghost"}
                  onClick={() => setShowSearch((v) => !v)}
                >
                  showSearch
                </Button>
                <Button
                  size="sm"
                  variant={allowClear ? "secondary" : "ghost"}
                  onClick={() => setAllowClear((v) => !v)}
                >
                  allowClear
                </Button>
                <Button
                  size="sm"
                  variant={disabled ? "secondary" : "ghost"}
                  onClick={() => setDisabled((v) => !v)}
                >
                  disabled
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-1 items-center justify-center rounded-xl border border-border bg-card p-10">
              <div className="w-full max-w-xs">
                <Select
                  key={mode}
                  options={OPTIONS}
                  mode={mode === "single" ? undefined : mode}
                  size={size}
                  showSearch={showSearch}
                  allowClear={allowClear}
                  disabled={disabled}
                  placeholder="Select…"
                  aria-label="Playground select"
                />
              </div>
            </div>
            <CodeBlock code={code} filename="preview.tsx" />
          </div>
        </div>
      </div>
    </section>
  )
}
