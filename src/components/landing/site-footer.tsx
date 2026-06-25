import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/landing/logo"
import { site } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-12 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Logo className="size-4" hole="var(--primary)" />
          </div>
          <div>
            <p className="text-sm font-semibold">{site.name}</p>
            <p className="text-xs text-muted-foreground">
              MIT Licensed · Built for React &amp; shadcn/ui
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <a href="#installation">Docs</a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={site.github} target="_blank" rel="noreferrer">
              <Star className="size-4" />
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}
