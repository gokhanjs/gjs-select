import { SectionHeading } from "@/components/landing/section-heading"

const PROPS = [
  {
    name: "options",
    type: "SelectItem<V>[]",
    default: "[]",
    description: "Options or optgroups to render. { label, value, disabled? }.",
  },
  {
    name: "value / defaultValue",
    type: "V | V[] | null",
    default: "—",
    description: "Controlled / uncontrolled selected value(s).",
  },
  {
    name: "onChange",
    type: "(value, option) => void",
    default: "—",
    description: "Fires when the selection changes.",
  },
  {
    name: "mode",
    type: '"multiple" | "tags"',
    default: "—",
    description: "Multi-select, or tags mode that creates new entries.",
  },
  {
    name: "showSearch",
    type: "boolean",
    default: "false*",
    description: "Filterable search input inside the control (* on by default in multi).",
  },
  {
    name: "allowClear",
    type: "boolean",
    default: "false",
    description: "Show a clear button to reset the value on hover.",
  },
  {
    name: "size",
    type: '"small" | "middle" | "large"',
    default: '"middle"',
    description: "Control height and typography.",
  },
  {
    name: "status",
    type: '"error" | "warning"',
    default: "—",
    description: "Validation status styling for the control.",
  },
  {
    name: "variant",
    type: '"outlined" | "filled" | "borderless"',
    default: '"outlined"',
    description: "Visual style of the control.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Show a spinner and loading state.",
  },
  {
    name: "maxCount",
    type: "number",
    default: "—",
    description: "Cap selections; remaining options disable at the limit.",
  },
  {
    name: "tokenSeparators",
    type: "string[]",
    default: "—",
    description: "Split typed/pasted input into multiple tags.",
  },
  {
    name: "virtual",
    type: "boolean",
    default: "false",
    description: "Windowed rendering for very long option lists.",
  },
  {
    name: "filterSort",
    type: "(a, b, info) => number",
    default: "—",
    description: "Custom ordering for the filtered options.",
  },
  {
    name: "labelInValue",
    type: "boolean",
    default: "false",
    description: "Emit { label, value } objects in onChange.",
  },
  {
    name: "fieldNames",
    type: "{ label, value, options }",
    default: "—",
    description: "Map custom keys on your option data.",
  },
]

export function PropsTable() {
  return (
    <section id="api" className="border-b border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Reference"
          title="Props API"
          description="A curated set of the most-used props. The component also forwards refs and standard combobox ARIA attributes."
        />

        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-3 font-medium text-muted-foreground">Prop</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Type</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Default</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {PROPS.map((prop) => (
                  <tr key={prop.name} className="border-b border-border last:border-0">
                    <td className="whitespace-nowrap px-5 py-4 align-top">
                      <code className="font-mono text-xs font-medium text-foreground">
                        {prop.name}
                      </code>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <code className="font-mono text-xs text-muted-foreground">
                        {prop.type}
                      </code>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 align-top">
                      <code className="font-mono text-xs text-muted-foreground">
                        {prop.default}
                      </code>
                    </td>
                    <td className="px-5 py-4 align-top text-muted-foreground">
                      {prop.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
