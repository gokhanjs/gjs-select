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

const OPTIONS = Array.from({ length: 10000 }, (_, i) => ({
  label: `Option ${i + 1}`,
  value: `opt-${i}`,
}))

export function DialogVirtual() {
  const popupId = React.useId()
  const popupContainer = () => document.getElementById(popupId) ?? document.body

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open 10k-option dialog</Button>
      </DialogTrigger>
      <DialogContent id={popupId}>
        <DialogHeader>
          <DialogTitle>Virtualized list in a dialog</DialogTitle>
          <DialogDescription>
            10,000 options, windowed with @tanstack/react-virtual. The dialog
            locks page scroll while the dropdown scrolls on its own.
          </DialogDescription>
        </DialogHeader>

        <Select
          options={OPTIONS}
          virtual
          showSearch
          allowClear
          placeholder="Search 10,000 options"
          getPopupContainer={popupContainer}
          aria-label="Virtualized options"
        />
      </DialogContent>
    </Dialog>
  )
}
