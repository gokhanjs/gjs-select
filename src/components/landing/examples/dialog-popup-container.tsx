"use client"

import * as React from "react"

import { Select } from "@/components/ui/gjs-select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const FRAMEWORKS = [
  { label: "Next.js", value: "next" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
  { label: "SvelteKit", value: "svelte" },
  { label: "Nuxt", value: "nuxt" },
  { label: "SolidStart", value: "solid" },
]

export function DialogPopupContainer() {
  // The left select scopes its dropdown to the dialog; the right one uses the
  // default (portal to <body>). Both stay interactive here because gjs-select
  // and the dialog are both Radix — scoping is the portable choice, not a fix
  // for a broken state.
  const popupId = React.useId()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent id={popupId}>
        <DialogHeader>
          <DialogTitle>getPopupContainer, side by side</DialogTitle>
          <DialogDescription>
            Both work — gjs-select and the dialog share Radix&apos;s layer system,
            so even the body-portaled dropdown stays interactive. Scoping it to
            the dialog is the portable choice for other modal libraries, z-index,
            and scroll.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Scoped to dialog</p>
            <Select
              options={FRAMEWORKS}
              showSearch
              allowClear
              placeholder="getPopupContainer"
              getPopupContainer={() =>
                document.getElementById(popupId) ?? document.body
              }
              aria-label="Scoped to dialog"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Portaled to body (default)</p>
            <Select
              options={FRAMEWORKS}
              showSearch
              allowClear
              placeholder="No getPopupContainer"
              aria-label="Portaled to body"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
