"use client"

import * as React from "react"

import { Select } from "@/components/ui/gjs-select"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const PRIORITIES = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
]

const ASSIGNEES = [
  { label: "Ada Lovelace", value: "ada" },
  { label: "Alan Turing", value: "alan" },
  { label: "Grace Hopper", value: "grace" },
  { label: "Linus Torvalds", value: "linus" },
  { label: "Margaret Hamilton", value: "margaret" },
  { label: "Dennis Ritchie", value: "dennis" },
]

export function DialogForm() {
  // Scope each dropdown to the dialog with getPopupContainer. It works without
  // this too — gjs-select and the Dialog are both Radix, so their layers
  // cooperate — but scoping keeps the popup portable to other modal libraries
  // and predictable for z-index and scroll.
  const popupId = React.useId()
  const popupContainer = () => document.getElementById(popupId) ?? document.body

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">New task</Button>
      </DialogTrigger>
      <DialogContent id={popupId}>
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
          <DialogDescription>
            Both selects render their dropdown inside the dialog via
            getPopupContainer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Priority</p>
            <Select
              options={PRIORITIES}
              defaultValue="medium"
              placeholder="Select priority"
              getPopupContainer={popupContainer}
              aria-label="Priority"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Assignees</p>
            <Select
              options={ASSIGNEES}
              mode="multiple"
              maxTagCount="responsive"
              showSearch
              allowClear
              placeholder="Add assignees"
              getPopupContainer={popupContainer}
              aria-label="Assignees"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Create task</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
