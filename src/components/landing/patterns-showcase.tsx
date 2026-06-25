import type { ReactNode } from "react"

import { SectionHeading } from "@/components/landing/section-heading"
import { RenderModes } from "@/components/landing/examples/render-modes"
import { AsyncSearch } from "@/components/landing/examples/async-search"
import { ResponsiveTags } from "@/components/landing/examples/responsive-tags"
import { VirtualList } from "@/components/landing/examples/virtual-list"
import { CustomRender } from "@/components/landing/examples/custom-render"
import { VariantSwitcher } from "@/components/landing/examples/variant-switcher"
import { LabelInValue } from "@/components/landing/examples/label-in-value"
import { SelectFormDemo } from "@/components/landing/examples/select-form-demo"

function PatternBlock({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export function PatternsShowcase() {
  return (
    <section id="patterns" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Patterns"
          title="Real-world patterns"
          description="Server and client rendering, 10k-row virtualization, custom rendering, variants, and a Zod-validated form — the cases you actually ship."
        />

        <div className="mt-10 space-y-5">
          <PatternBlock
            title="Drop into Server Components"
            description="Select is a client island — render it straight inside a Server Component page (the App Router pattern), shown beside a Client Component for comparison."
          >
            <RenderModes />
          </PatternBlock>

          <div className="grid gap-5 lg:grid-cols-2">
            <PatternBlock
              title="Debounced async search"
              description="showSearch · filterOption={false} · onSearch → fetch · loading — server-side filtering over a live API route."
            >
              <AsyncSearch />
            </PatternBlock>

            <PatternBlock
              title="Responsive tag overflow"
              description='maxTagCount="responsive" collapses tags that no longer fit into a +N pill as the control resizes.'
            >
              <ResponsiveTags />
            </PatternBlock>

            <PatternBlock
              title="Virtualized 10k options"
              description="virtual mounts only the rows in view (@tanstack/react-virtual), so a 10,000-option list opens and scrolls without jank."
            >
              <VirtualList />
            </PatternBlock>

            <PatternBlock
              title="Custom option & tag rendering"
              description="optionRender and tagRender take full React nodes — avatars, secondary text, and bespoke pills."
            >
              <CustomRender />
            </PatternBlock>

            <PatternBlock
              title="Variants"
              description='variant="outlined | filled | borderless" — switch the chrome to match the surface it sits on.'
            >
              <VariantSwitcher />
            </PatternBlock>

            <PatternBlock
              title="Label in value + maxCount"
              description="labelInValue emits { label, value } objects; maxCount caps how many tags can be selected."
            >
              <LabelInValue />
            </PatternBlock>
          </div>

          <PatternBlock
            title="react-hook-form + Zod"
            description="SelectFormField binds Select to react-hook-form with a Zod resolver — validation status, error messages, and ARIA wiring come for free."
          >
            <SelectFormDemo />
          </PatternBlock>
        </div>
      </div>
    </section>
  )
}
