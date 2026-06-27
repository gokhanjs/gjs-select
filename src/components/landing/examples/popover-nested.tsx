"use client"

import * as React from "react"

import { Select } from "@/components/ui/gjs-select"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const LISTS = [
  { label: "Backlog", value: "backlog" },
  { label: "To do", value: "todo" },
  { label: "In progress", value: "in-progress" },
  { label: "In review", value: "review" },
  { label: "Done", value: "done" },
]

export function PopoverNested() {
  // A popover is itself a portal; the select opens a second portal inside it.
  // Scoping the dropdown to the popover keeps the two stacked correctly.
  const popupId = React.useId()
  const popupContainer = () => document.getElementById(popupId) ?? document.body

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Move to list…</Button>
      </PopoverTrigger>
      <PopoverContent id={popupId} className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Move to list</p>
          <p className="text-xs text-muted-foreground">
            A select nested inside a popover — a portal within a portal.
          </p>
        </div>
        <Select
          options={LISTS}
          showSearch
          placeholder="Choose a list"
          getPopupContainer={popupContainer}
          aria-label="List"
        />
      </PopoverContent>
    </Popover>
  )
}
