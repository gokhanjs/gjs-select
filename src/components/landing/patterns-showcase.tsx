import fs from "node:fs"
import path from "node:path"
import type { ReactNode } from "react"

import { SectionHeading } from "@/components/landing/section-heading"
import { CodePreview } from "@/components/landing/code-preview"
import { AsyncSearch } from "@/components/landing/examples/async-search"
import { ResponsiveTags } from "@/components/landing/examples/responsive-tags"
import { VirtualList } from "@/components/landing/examples/virtual-list"
import { CustomRender } from "@/components/landing/examples/custom-render"
import { VariantSwitcher } from "@/components/landing/examples/variant-switcher"
import { LabelInValue } from "@/components/landing/examples/label-in-value"
import { PrefixSuffix } from "@/components/landing/examples/prefix-suffix"
import { StatusStates } from "@/components/landing/examples/status-states"
import { DropdownRender } from "@/components/landing/examples/dropdown-render"
import { RtlDirection } from "@/components/landing/examples/rtl-direction"
import { SelectFormDemo } from "@/components/landing/examples/select-form-demo"

const EXAMPLES_DIR = path.join(process.cwd(), "src/components/landing/examples")

// Read an example's own source at build time so the Code tab always mirrors the
// rendered Preview — no hand-maintained code strings that can drift.
function readExample(file: string): string {
  return fs.readFileSync(path.join(EXAMPLES_DIR, file), "utf8").trimEnd()
}

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
  const source = {
    asyncSearch: readExample("async-search.tsx"),
    responsiveTags: readExample("responsive-tags.tsx"),
    virtualList: readExample("virtual-list.tsx"),
    customRender: readExample("custom-render.tsx"),
    variantSwitcher: readExample("variant-switcher.tsx"),
    labelInValue: readExample("label-in-value.tsx"),
    prefixSuffix: readExample("prefix-suffix.tsx"),
    statusStates: readExample("status-states.tsx"),
    dropdownRender: readExample("dropdown-render.tsx"),
    rtlDirection: readExample("rtl-direction.tsx"),
    selectFormDemo: readExample("select-form-demo.tsx"),
  }

  return (
    <section id="patterns" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Patterns"
          title="Real-world patterns"
          description="Async search, 10k-row virtualization, custom rendering, variants, validation states, RTL, and a Zod-validated form — the cases you actually ship."
        />

        <div className="mt-10 space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <PatternBlock
              title="Debounced async search"
              description="showSearch · filterOption={false} · onSearch → fetch · loading — server-side filtering over a live API route."
            >
              <CodePreview code={source.asyncSearch} filename="async-search.tsx">
                <AsyncSearch />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Responsive tag overflow"
              description='maxTagCount="responsive" collapses tags that no longer fit into a +N pill as the control resizes.'
            >
              <CodePreview code={source.responsiveTags} filename="responsive-tags.tsx">
                <ResponsiveTags />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Virtualized 10k options"
              description="virtual mounts only the rows in view (@tanstack/react-virtual), so a 10,000-option list opens and scrolls without jank."
            >
              <CodePreview code={source.virtualList} filename="virtual-list.tsx">
                <VirtualList />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Custom option & tag rendering"
              description="optionRender and tagRender take full React nodes — avatars, secondary text, and bespoke pills."
            >
              <CodePreview code={source.customRender} filename="custom-render.tsx">
                <CustomRender />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Variants"
              description='variant="outlined | filled | borderless" — switch the chrome to match the surface it sits on.'
            >
              <CodePreview code={source.variantSwitcher} filename="variant-switcher.tsx">
                <VariantSwitcher />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Label in value + maxCount"
              description="labelInValue emits { label, value } objects; maxCount caps how many tags can be selected."
            >
              <CodePreview code={source.labelInValue} filename="label-in-value.tsx">
                <LabelInValue />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Prefix & custom suffix"
              description="prefix renders a node before the value; suffixIcon swaps the trigger affordance."
            >
              <CodePreview code={source.prefixSuffix} filename="prefix-suffix.tsx">
                <PrefixSuffix />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Validation states"
              description='status="error | warning" tints the trigger to match form-validation feedback.'
            >
              <CodePreview code={source.statusStates} filename="status-states.tsx">
                <StatusStates />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Custom dropdown footer"
              description="dropdownRender wraps the menu — append a sticky footer, an action, or any custom content."
            >
              <CodePreview code={source.dropdownRender} filename="dropdown-render.tsx">
                <DropdownRender />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Right-to-left"
              description='direction="rtl" mirrors the full layout for Arabic, Hebrew, and Persian.'
            >
              <CodePreview code={source.rtlDirection} filename="rtl-direction.tsx">
                <RtlDirection />
              </CodePreview>
            </PatternBlock>
          </div>

          <PatternBlock
            title="react-hook-form + Zod"
            description="SelectFormField binds Select to react-hook-form with a Zod resolver — validation status, error messages, and ARIA wiring come for free."
          >
            <CodePreview code={source.selectFormDemo} filename="select-form-demo.tsx">
              <SelectFormDemo />
            </CodePreview>
          </PatternBlock>
        </div>
      </div>
    </section>
  )
}
