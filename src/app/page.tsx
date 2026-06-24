"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Select } from "@/components/ui/select"
import { SelectFormField } from "@/components/ui/select-form"

const FRUITS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Durian", value: "durian", disabled: true },
  { label: "Elderberry", value: "elderberry" },
]

const GROUPED = [
  {
    label: "Fruits",
    options: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
    ],
  },
  {
    label: "Vegetables",
    options: [
      { label: "Carrot", value: "carrot" },
      { label: "Daikon", value: "daikon" },
    ],
  },
]

const MANY = Array.from({ length: 500 }, (_, i) => ({
  label: `Option ${i + 1}`,
  value: `opt-${i + 1}`,
}))

const COUNTRIES = [
  { label: "Türkiye", value: "tr" },
  { label: "Germany", value: "de" },
  { label: "United States", value: "us" },
  { label: "France", value: "fr" },
  { label: "Japan", value: "jp" },
]

const SKILLS = [
  { label: "TypeScript", value: "ts" },
  { label: "React", value: "react" },
  { label: "Node.js", value: "node" },
  { label: "PostgreSQL", value: "pg" },
  { label: "Docker", value: "docker" },
  { label: "GraphQL", value: "gql" },
]

const profileSchema = z.object({
  country: z.string({ required_error: "Ülke seçimi zorunludur" }).min(1, "Ülke seçimi zorunludur"),
  skills: z
    .array(z.string())
    .min(2, "En az 2 beceri seçin")
    .max(4, "En fazla 4 beceri seçebilirsiniz"),
})

type ProfileSchema = z.infer<typeof profileSchema>

function RHFDemo() {
  const [submitted, setSubmitted] = useState<ProfileSchema | null>(null)

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: { country: "", skills: [] },
  })

  const onSubmit = (data: ProfileSchema) => setSubmitted(data)

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4" data-testid="rhf-form">
      <SelectFormField
        control={form.control}
        name="country"
        label="Ülke"
        required
        description="Profiliniz için bir ülke seçin"
        options={COUNTRIES}
        showSearch
        allowClear
        placeholder="Ülke seçin"
      />

      <SelectFormField
        control={form.control}
        name="skills"
        label="Beceriler"
        required
        description="2-4 beceri seçebilirsiniz"
        options={SKILLS}
        mode="multiple"
        maxTagCount={3}
        placeholder="Beceri seçin"
      />

      <button
        type="submit"
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Kaydet
      </button>

      {submitted && (
        <div
          role="status"
          aria-live="polite"
          data-testid="rhf-success"
          className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800"
        >
          <p className="font-medium">✓ Form başarıyla gönderildi</p>
          <p>Ülke: {submitted.country}</p>
          <p>Beceriler: {submitted.skills.join(", ")}</p>
        </div>
      )}
    </form>
  )
}

export default function Page() {
  const [single, setSingle] = useState<string | null>(null)
  const [multi, setMulti] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])

  return (
    <main className="mx-auto max-w-xl space-y-8 p-10">
      <h1 className="text-2xl font-bold">GJS Select</h1>

      <section className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Single</p>
        <Select
          options={FRUITS}
          value={single}
          onChange={(v) => setSingle(v as string | null)}
          allowClear
          placeholder="Pick a fruit"
        />
        <p className="text-xs text-muted-foreground">value: {single ?? "–"}</p>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Single + search</p>
        <Select options={FRUITS} showSearch allowClear placeholder="Search fruits" />
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Grouped</p>
        <Select options={GROUPED} allowClear placeholder="Pick one" />
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Multiple</p>
        <Select
          options={FRUITS}
          mode="multiple"
          value={multi}
          onChange={(v) => setMulti(v as string[])}
          allowClear
          placeholder="Pick fruits"
          maxTagCount={3}
        />
        <p className="text-xs text-muted-foreground">value: [{multi.join(", ")}]</p>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Tags (create new)</p>
        <Select
          options={FRUITS}
          mode="tags"
          value={tags}
          onChange={(v) => setTags(v as string[])}
          allowClear
          placeholder="Type to create"
        />
        <p className="text-xs text-muted-foreground">value: [{tags.join(", ")}]</p>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Sizes</p>
        <div className="space-y-2">
          <Select options={FRUITS} size="small" placeholder="Small" />
          <Select options={FRUITS} size="middle" placeholder="Middle" />
          <Select options={FRUITS} size="large" placeholder="Large" />
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Status</p>
        <Select options={FRUITS} status="error" placeholder="Error state" />
        <Select options={FRUITS} status="warning" placeholder="Warning state" />
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Variants</p>
        <Select options={FRUITS} variant="outlined" placeholder="Outlined" />
        <Select options={FRUITS} variant="filled" placeholder="Filled" />
        <Select options={FRUITS} variant="borderless" placeholder="Borderless" />
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Loading / Disabled</p>
        <Select options={FRUITS} loading placeholder="Loading..." />
        <Select options={FRUITS} disabled placeholder="Disabled" />
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Virtual (500 items)</p>
        <Select options={MANY} virtual showSearch placeholder="Search 500 items" allowClear />
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Custom optionRender</p>
        <Select
          options={FRUITS}
          optionRender={(opt) => (
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              {opt.label}
            </span>
          )}
          placeholder="Custom render"
        />
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">React Hook Form + Zod</p>
          <p className="text-xs text-muted-foreground">
            Country required • Skills min 2 / max 4
          </p>
        </div>
        <RHFDemo />
      </section>
    </main>
  )
}
