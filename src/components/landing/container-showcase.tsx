import fs from "node:fs"
import path from "node:path"
import type { ReactNode } from "react"

import { SectionHeading } from "@/components/landing/section-heading"
import { CodePreview } from "@/components/landing/code-preview"
import { DialogForm } from "@/components/landing/examples/dialog-form"
import { CustomDialog } from "@/components/landing/examples/custom-dialog"
import { SheetFilters } from "@/components/landing/examples/sheet-filters"
import { DrawerMobile } from "@/components/landing/examples/drawer-mobile"
import { DialogScroll } from "@/components/landing/examples/dialog-scroll"
import { DialogPopupContainer } from "@/components/landing/examples/dialog-popup-container"
import { DialogVirtual } from "@/components/landing/examples/dialog-virtual"
import { PopoverNested } from "@/components/landing/examples/popover-nested"

const EXAMPLES_DIR = path.join(process.cwd(), "src/components/landing/examples")

// Read each example's own source at build time so the Code tab mirrors the
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

export function ContainerShowcase() {
  const source = {
    dialogForm: readExample("dialog-form.tsx"),
    customDialog: readExample("custom-dialog.tsx"),
    sheetFilters: readExample("sheet-filters.tsx"),
    drawerMobile: readExample("drawer-mobile.tsx"),
    dialogScroll: readExample("dialog-scroll.tsx"),
    dialogPopupContainer: readExample("dialog-popup-container.tsx"),
    dialogVirtual: readExample("dialog-virtual.tsx"),
    popoverNested: readExample("popover-nested.tsx"),
  }

  return (
    <section id="overlays" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="In overlays"
          title="Inside dialogs, sheets & drawers"
          description="The select opens a portal of its own. getPopupContainer scopes that dropdown to the overlay — a portable best-practice that stays predictable across modal libraries, z-index layers, and scrolling containers."
        />

        <div className="mt-10 space-y-5">
          {/* Educational centerpiece, full width: the prop that makes the rest work. */}
          <PatternBlock
            title="getPopupContainer, side by side"
            description="Two selects in one modal. Both stay interactive — gjs-select and the dialog share Radix's layer system. The left scopes its dropdown to the dialog (the portable choice); the right takes the default and portals to <body>."
          >
            <CodePreview
              code={source.dialogPopupContainer}
              filename="dialog-popup-container.tsx"
            >
              <DialogPopupContainer />
            </CodePreview>
          </PatternBlock>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <PatternBlock
              title="Dialog — form"
              description="A modal form with single + multiple selects. getPopupContainer keeps both dropdowns inside the dialog."
            >
              <CodePreview code={source.dialogForm} filename="dialog-form.tsx">
                <DialogForm />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Custom dialog (no Radix)"
              description="Your own modal — or antd Modal, react-modal, etc. getPopupContainer scopes the dropdown to it; the integration is identical everywhere."
            >
              <CodePreview code={source.customDialog} filename="custom-dialog.tsx">
                <CustomDialog />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Sheet — filter panel"
              description='A right-side sheet. Narrow width with maxTagCount="responsive" for tidy multi-selects.'
            >
              <CodePreview code={source.sheetFilters} filename="sheet-filters.tsx">
                <SheetFilters />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Drawer — bottom sheet"
              description="A vaul drawer, common on mobile. getPopupContainer targets the content by id — vaul doesn't forward a ref."
            >
              <CodePreview code={source.drawerMobile} filename="drawer-mobile.tsx">
                <DrawerMobile />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Full-height dialog with scroll"
              description="A tall dialog whose body scrolls. Open the select at the bottom — the dropdown stays anchored and flips up when needed."
            >
              <CodePreview code={source.dialogScroll} filename="dialog-scroll.tsx">
                <DialogScroll />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Virtualized list in a dialog"
              description="10,000 windowed options inside a dialog — page scroll is locked while the dropdown scrolls on its own."
            >
              <CodePreview code={source.dialogVirtual} filename="dialog-virtual.tsx">
                <DialogVirtual />
              </CodePreview>
            </PatternBlock>

            <PatternBlock
              title="Nested in a popover"
              description="A select opened inside a popover — a portal within a portal, stacked correctly."
            >
              <CodePreview code={source.popoverNested} filename="popover-nested.tsx">
                <PopoverNested />
              </CodePreview>
            </PatternBlock>
          </div>
        </div>
      </div>
    </section>
  )
}
