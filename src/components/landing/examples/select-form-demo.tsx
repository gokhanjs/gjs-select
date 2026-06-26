"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { SelectFormField } from "@/components/ui/select-form"
import { Button } from "@/components/ui/button"

const schema = z.object({
  framework: z.string().min(1, "Pick a framework"),
  features: z.array(z.string()).min(1, "Choose at least one feature"),
})

type FormValues = z.infer<typeof schema>

const FRAMEWORKS = [
  { label: "Next.js", value: "next" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
]

const FEATURES = [
  { label: "Server search", value: "search" },
  { label: "Virtualization", value: "virtual" },
  { label: "RTL", value: "rtl" },
  { label: "Theming", value: "theming" },
]

export function SelectFormDemo() {
  const [submitted, setSubmitted] = React.useState<FormValues | null>(null)
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { framework: null as unknown as string, features: [] },
  })

  return (
    <form
      onSubmit={handleSubmit((values) => setSubmitted(values))}
      className="grid gap-5 sm:grid-cols-2"
    >
      <div className="min-w-0 space-y-4">
        <SelectFormField
          control={control}
          name="framework"
          label="Framework"
          required
          options={FRAMEWORKS}
          placeholder="Select one"
          allowClear
        />
        <SelectFormField
          control={control}
          name="features"
          label="Features"
          required
          mode="multiple"
          options={FEATURES}
          placeholder="Select at least one"
          maxTagCount="responsive"
        />
        <Button type="submit">Validate</Button>
      </div>
      <div className="min-w-0 space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">
          Submitted payload
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted/40 p-3 font-mono text-xs leading-5 text-muted-foreground">
          {submitted ? JSON.stringify(submitted, null, 2) : "— submit to validate —"}
        </pre>
      </div>
    </form>
  )
}
