"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  className?: string
  /** Cap the code area height and scroll within it — for long source listings. */
  scroll?: boolean
}

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  className,
  scroll = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-muted/40",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          {filename ?? language}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Copy code"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="size-3.5 text-foreground" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>
      <pre
        className={cn(
          "p-4 text-sm leading-relaxed",
          scroll ? "max-h-96 overflow-auto" : "overflow-x-auto",
        )}
      >
        <code className="font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  )
}
