"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { Select } from "@/components/ui/gjs-select"
import { Button } from "@/components/ui/button"

const PLANS = [
  { label: "Free", value: "free" },
  { label: "Pro", value: "pro" },
  { label: "Team", value: "team" },
  { label: "Enterprise", value: "enterprise" },
]

// A minimal, dependency-free modal — it stands in for any non-shadcn dialog:
// your own hand-rolled one, antd's <Modal>, react-modal, etc. Give the content
// an id and point getPopupContainer at it so the dropdown renders inside the
// modal: predictable stacking and scroll, and a portable default that holds up
// in modals that aren't Radix-friendly.
function CustomModal({
  open,
  onClose,
  labelledBy,
  contentId,
  children,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  contentId: string
  children: React.ReactNode
}) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        id={contentId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative z-10 w-full max-w-sm rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg"
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function CustomDialog() {
  const [open, setOpen] = React.useState(false)
  const titleId = React.useId()
  const contentId = React.useId()

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open custom dialog
      </Button>

      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        labelledBy={titleId}
        contentId={contentId}
      >
        <div className="space-y-1">
          <h2 id={titleId} className="text-base font-medium">
            Change plan
          </h2>
          <p className="text-sm text-muted-foreground">
            A hand-rolled modal — no Radix. getPopupContainer scopes the dropdown
            to it; the same pattern fits antd Modal or any custom dialog.
          </p>
        </div>

        <div className="mt-4 space-y-1.5">
          <p className="text-sm font-medium">Plan</p>
          <Select
            options={PLANS}
            defaultValue="pro"
            showSearch
            allowClear
            placeholder="Select plan"
            getPopupContainer={() => document.getElementById(contentId) ?? document.body}
            aria-label="Plan"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </div>
      </CustomModal>
    </>
  )
}
