import type { ReactNode } from "react"

import { Select } from "@/components/ui/gjs-select"
import { SectionHeading } from "@/components/landing/section-heading"
import { cn } from "@/lib/utils"

const FRUITS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Durian", value: "durian", disabled: true },
  { label: "Elderberry", value: "elderberry" },
]

const GROUPED = [
  {
    label: "Fruits",
    options: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
    ],
  },
  {
    label: "Vegetables",
    options: [
      { label: "Carrot", value: "carrot" },
      { label: "Daikon", value: "daikon" },
    ],
  },
]

function PreviewCard({
  title,
  description,
  children,
  className,
}: {
  title: string
  description: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">{children}</div>
    </div>
  )
}

export function VariantsShowcase() {
  return (
    <section id="showcase" className="border-b border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Showcase"
          title="Every mode, out of the box"
          description="Single, multiple, and tags modes; search, clear, optgroups, sizes, and built-in states — all driven by simple props."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <PreviewCard
            title="Modes"
            description='Single by default, or mode="multiple | tags"'
          >
            <Select options={FRUITS} placeholder="Single" aria-label="Single select" />
            <Select
              options={FRUITS}
              mode="multiple"
              defaultValue={["apple", "banana"]}
              placeholder="Multiple"
              aria-label="Multiple select"
            />
            <Select
              options={FRUITS}
              mode="tags"
              tokenSeparators={[","]}
              placeholder="Tags — type to create"
              aria-label="Tags select"
            />
          </PreviewCard>

          <PreviewCard
            title="Search, clear & groups"
            description="showSearch · allowClear · optgroups"
          >
            <Select
              options={FRUITS}
              showSearch
              allowClear
              placeholder="Search…"
              aria-label="Searchable select"
            />
            <Select
              options={GROUPED}
              allowClear
              placeholder="Grouped options"
              aria-label="Grouped select"
            />
          </PreviewCard>

          <PreviewCard title="Sizes" description='size="small | middle | large"'>
            <Select options={FRUITS} size="small" placeholder="Small" aria-label="Small select" />
            <Select options={FRUITS} size="middle" placeholder="Middle" aria-label="Middle select" />
            <Select options={FRUITS} size="large" placeholder="Large" aria-label="Large select" />
          </PreviewCard>

          <PreviewCard
            title="States"
            description="disabled · loading · status=error"
          >
            <Select options={FRUITS} disabled placeholder="Disabled" aria-label="Disabled select" />
            <Select options={FRUITS} loading placeholder="Loading" aria-label="Loading select" />
            <Select options={FRUITS} status="error" placeholder="Error state" aria-label="Error select" />
          </PreviewCard>
        </div>
      </div>
    </section>
  )
}
