"use client"

import { Plus } from "lucide-react"

import { Select } from "@/components/ui/gjs-select"

const LABELS = [
  { label: "Bug", value: "bug" },
  { label: "Feature", value: "feature" },
  { label: "Documentation", value: "docs" },
  { label: "Question", value: "question" },
]

export function DropdownRender() {
  return (
    <Select
      options={LABELS}
      mode="multiple"
      showSearch
      placeholder="Assign labels"
      dropdownRender={(menu) => (
        <>
          {menu}
          <div className="mt-1 border-t border-border pt-1">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Plus className="size-4" />
              Create new label
            </button>
          </div>
        </>
      )}
      aria-label="Select with a custom dropdown footer"
    />
  )
}
