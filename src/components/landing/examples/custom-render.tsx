"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Select, type SelectOption } from "@/components/ui/gjs-select"
import { cn } from "@/lib/utils"

// Extra fields ride along on each option (SelectOption allows arbitrary keys)
// and are read back inside optionRender / tagRender.
const PEOPLE: SelectOption[] = [
  { label: "Ada Lovelace", value: "ada", initials: "AL", role: "Engineering" },
  { label: "Grace Hopper", value: "grace", initials: "GH", role: "Compilers" },
  { label: "Alan Turing", value: "alan", initials: "AT", role: "Research" },
  { label: "Katherine Johnson", value: "kj", initials: "KJ", role: "Mathematics" },
  { label: "Linus Torvalds", value: "linus", initials: "LT", role: "Kernel" },
]

function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium",
        className,
      )}
    >
      {initials}
    </span>
  )
}

export function CustomRender() {
  const [value, setValue] = React.useState<string[]>(["ada", "grace"])

  return (
    <Select
      mode="multiple"
      options={PEOPLE}
      value={value}
      onChange={(v) => setValue((v as string[]) ?? [])}
      placeholder="Add teammates"
      aria-label="Team member picker"
      optionRender={(option) => {
        // optionRender only receives { index } — derive the selected state from
        // your own value, then style it however you like. Here a tinted avatar
        // and an "Added" pill stand in for the default trailing check.
        const selected = value.includes(String(option.value))
        return (
          <div className="flex w-full items-center gap-2">
            <Avatar
              initials={option.initials as string}
              className={selected ? "bg-primary/15 text-primary" : undefined}
            />
            <span className="flex flex-col">
              <span className={cn("text-sm", selected && "font-medium")}>
                {option.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {option.role as string}
              </span>
            </span>
            {selected && (
              <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                Added
              </span>
            )}
          </div>
        )
      }}
      tagRender={({ label, value: tagValue, onClose }) => (
        <span className="m-0.5 inline-flex items-center gap-1 rounded-full bg-muted py-0.5 pr-1 pl-0.5 text-xs">
          <Avatar
            initials={
              (PEOPLE.find((p) => p.value === tagValue)?.initials as string) ?? ""
            }
          />
          <span>{label}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Remove ${label}`}
            className="flex size-4 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/10 hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </span>
      )}
    />
  )
}
