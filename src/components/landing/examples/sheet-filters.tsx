"use client"

import * as React from "react"

import { Select } from "@/components/ui/gjs-select"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const CATEGORIES = [
  { label: "Laptops", value: "laptops" },
  { label: "Phones", value: "phones" },
  { label: "Audio", value: "audio" },
  { label: "Cameras", value: "cameras" },
  { label: "Accessories", value: "accessories" },
]

const BRANDS = [
  { label: "Apple", value: "apple" },
  { label: "Samsung", value: "samsung" },
  { label: "Sony", value: "sony" },
  { label: "Dell", value: "dell" },
  { label: "Logitech", value: "logitech" },
  { label: "Anker", value: "anker" },
]

const TAGS = [
  { label: "In stock", value: "in-stock" },
  { label: "On sale", value: "on-sale" },
  { label: "Free shipping", value: "free-shipping" },
]

export function SheetFilters() {
  // Scope the dropdown to the sheet. It works without this too (both are Radix),
  // but scoping keeps the popup portable and predictable for z-index and scroll.
  const popupId = React.useId()
  const popupContainer = () => document.getElementById(popupId) ?? document.body

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </SheetTrigger>
      <SheetContent id={popupId} side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            A narrow side panel — maxTagCount=&quot;responsive&quot; keeps the
            multi-selects tidy.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Category</p>
            <Select
              options={CATEGORIES}
              showSearch
              allowClear
              placeholder="Any category"
              getPopupContainer={popupContainer}
              aria-label="Category"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Brands</p>
            <Select
              options={BRANDS}
              mode="multiple"
              maxTagCount="responsive"
              allowClear
              placeholder="Any brand"
              getPopupContainer={popupContainer}
              aria-label="Brands"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Tags</p>
            <Select
              options={TAGS}
              mode="tags"
              maxTagCount="responsive"
              placeholder="Add tags"
              getPopupContainer={popupContainer}
              aria-label="Tags"
            />
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button>Apply filters</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline">Reset</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
