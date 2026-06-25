"use client"

import type { ReactNode } from "react"

import { CodeBlock } from "@/components/landing/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CodePreviewProps {
  code: string
  filename?: string
  children: ReactNode
}

export function CodePreview({ code, filename, children }: CodePreviewProps) {
  return (
    <Tabs defaultValue="preview" className="gap-4">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">{children}</TabsContent>
      <TabsContent value="code">
        <CodeBlock code={code} filename={filename} scroll />
      </TabsContent>
    </Tabs>
  )
}
