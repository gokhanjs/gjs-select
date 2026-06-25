import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

// Presentational card chrome shared by the render-mode examples. It holds no
// client state, so it renders in both server and client components.
export function ExampleCard({
  badge,
  tone,
  marker,
  detail,
  children,
}: {
  badge: string
  tone: "server" | "client"
  marker: string
  detail: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          data-example-badge={tone}
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            tone === "server"
              ? "bg-primary/10 text-primary"
              : "bg-muted text-foreground",
          )}
        >
          {badge}
        </span>
        <span className="text-xs text-muted-foreground">{marker}</span>
      </div>
      {children}
      <p className="text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  )
}
