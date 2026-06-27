"use client"

import * as React from "react"

import { Select } from "@/components/ui/gjs-select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const COUNTRIES = [
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
  { label: "Spain", value: "es" },
  { label: "Italy", value: "it" },
  { label: "Netherlands", value: "nl" },
  { label: "Sweden", value: "se" },
  { label: "Poland", value: "pl" },
  { label: "Portugal", value: "pt" },
]

const TIMEZONES = [
  { label: "UTC−08:00 Pacific", value: "pst" },
  { label: "UTC−05:00 Eastern", value: "est" },
  { label: "UTC+00:00 London", value: "gmt" },
  { label: "UTC+01:00 Berlin", value: "cet" },
  { label: "UTC+03:00 Istanbul", value: "trt" },
  { label: "UTC+09:00 Tokyo", value: "jst" },
]

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "German", value: "de" },
  { label: "Turkish", value: "tr" },
  { label: "Spanish", value: "es" },
  { label: "Japanese", value: "ja" },
]

export function DialogScroll() {
  const popupId = React.useId()
  const popupContainer = () => document.getElementById(popupId) ?? document.body

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open full-height dialog</Button>
      </DialogTrigger>
      {/* Full height: pin to top-4 / bottom-4 (instead of vertical centering)
          and let the body scroll. The header and footer stay put while the
          middle scrolls; dropdowns still mount inside the dialog. */}
      <DialogContent
        id={popupId}
        className="top-4 bottom-4 left-1/2 flex w-full max-w-md -translate-x-1/2 translate-y-0 flex-col gap-0 p-0"
      >
        <DialogHeader className="border-b border-border p-4">
          <DialogTitle>Account preferences</DialogTitle>
          <DialogDescription>
            A tall dialog whose body scrolls. Open the select at the very bottom —
            the dropdown stays anchored to its trigger.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Country</p>
            <Select
              options={COUNTRIES}
              showSearch
              allowClear
              placeholder="Country"
              getPopupContainer={popupContainer}
              aria-label="Country"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Notifications, security, and billing sections would live here. The
            filler below exists only to make the body taller than the viewport so
            you can scroll the dialog.
          </p>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Time zone</p>
            <Select
              options={TIMEZONES}
              showSearch
              placeholder="Time zone"
              getPopupContainer={popupContainer}
              aria-label="Time zone"
            />
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Keep scrolling. Long forms are exactly where a select&apos;s
              dropdown placement matters — it must follow its trigger, not jump to
              a corner of the screen.
            </p>
            <p>
              The dropdown is anchored with collision handling, so opening it near
              the bottom flips it upward when there isn&apos;t room below.
            </p>
            <p>
              This block is intentionally verbose to push the final field past the
              fold. Almost there.
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Language (bottom of the scroll)</p>
            <Select
              options={LANGUAGES}
              showSearch
              placeholder="Language"
              getPopupContainer={popupContainer}
              aria-label="Language"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save preferences</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
