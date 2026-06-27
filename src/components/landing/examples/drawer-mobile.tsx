"use client"

import * as React from "react"

import { Select } from "@/components/ui/gjs-select"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const CITIES = [
  { label: "Berlin", value: "berlin" },
  { label: "Munich", value: "munich" },
  { label: "Hamburg", value: "hamburg" },
  { label: "Cologne", value: "cologne" },
  { label: "Frankfurt", value: "frankfurt" },
  { label: "Stuttgart", value: "stuttgart" },
  { label: "Düsseldorf", value: "dusseldorf" },
]

export function DrawerMobile() {
  // vaul drives the drawer and doesn't forward a ref, so target the content by
  // id. This scopes the dropdown to the drawer; it stays interactive either way.
  const popupId = React.useId()
  const popupContainer = () => document.getElementById(popupId) ?? document.body

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent id={popupId}>
        <DrawerHeader>
          <DrawerTitle>Plan a trip</DrawerTitle>
          <DrawerDescription>
            A bottom drawer, common on mobile. The dropdown mounts inside so the
            drag gesture never steals the interaction.
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4 px-4 pb-2">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Pickup</p>
            <Select
              options={CITIES}
              showSearch
              allowClear
              placeholder="Pickup city"
              getPopupContainer={popupContainer}
              aria-label="Pickup"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Stops</p>
            <Select
              options={CITIES}
              mode="multiple"
              maxTagCount="responsive"
              placeholder="Add stops"
              getPopupContainer={popupContainer}
              aria-label="Stops"
            />
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Confirm</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
