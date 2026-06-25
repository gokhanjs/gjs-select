import { ArrowRight, Star, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { CodeBlock } from "@/components/landing/code-block"
import { site } from "@/lib/site"

const FRAMEWORKS = [
  { label: "Next.js", value: "next" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
  { label: "Vite", value: "vite" },
  { label: "TanStack Start", value: "tanstack" },
]

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--color-muted),transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5" />
            v1.0 · Production-grade Select for shadcn/ui
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            The Select shadcn/ui is missing.
          </h1>

          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            Single, multiple, and tags modes. Built-in search, virtualized lists,
            and full keyboard &amp; screen-reader support — production-grade behavior in
            one copy-paste component.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <a href="#installation">
                Get started
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={site.github} target="_blank" rel="noreferrer">
                <Star className="size-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-14 flex max-w-md flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Try it
            </p>
            <Select
              options={FRAMEWORKS}
              showSearch
              allowClear
              placeholder="Search a framework…"
              aria-label="Framework picker demo"
            />
          </div>
          <CodeBlock code={site.installCmd} language="bash" filename="terminal" />
        </div>
      </div>
    </section>
  )
}
