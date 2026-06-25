import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/landing/logo"
import { ThemeToggle } from "@/components/landing/theme-toggle"
import { site } from "@/lib/site"

const NAV_LINKS = [
  { label: "Installation", href: "#installation" },
  { label: "Showcase", href: "#showcase" },
  { label: "Patterns", href: "#patterns" },
  { label: "Usage", href: "#usage" },
  { label: "API", href: "#api" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Logo className="size-4" hole="var(--primary)" />
          </div>
          <span className="text-sm font-semibold tracking-tight">{site.name}</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm">
              <a href={link.href}>{link.label}</a>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
            >
              <Star className="size-4" />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
