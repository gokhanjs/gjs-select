"use client"

import { ChevronsUpDown, Globe } from "lucide-react"

import { Select } from "@/components/ui/gjs-select"

const REGIONS = [
  { label: "United States", value: "us" },
  { label: "European Union", value: "eu" },
  { label: "United Kingdom", value: "uk" },
  { label: "Japan", value: "jp" },
  { label: "Australia", value: "au" },
]

export function PrefixSuffix() {
  return (
    <Select
      options={REGIONS}
      defaultValue="eu"
      showSearch
      prefix={<Globe className="size-4 text-muted-foreground" />}
      suffixIcon={<ChevronsUpDown className="size-4 text-muted-foreground" />}
      placeholder="Select a region"
      aria-label="Region picker with a leading icon and a custom suffix"
    />
  )
}
