"use client"

import { Select } from "@/components/ui/select"

const LANGUAGES = [
  { label: "العربية", value: "ar" },
  { label: "עברית", value: "he" },
  { label: "فارسی", value: "fa" },
  { label: "اردو", value: "ur" },
]

export function RtlDirection() {
  return (
    <Select
      options={LANGUAGES}
      direction="rtl"
      mode="multiple"
      defaultValue={["ar", "he"]}
      showSearch
      placeholder="اختر لغة"
      aria-label="Right-to-left select"
    />
  )
}
