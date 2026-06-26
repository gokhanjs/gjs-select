// Single source of truth for site-wide constants (links, registry URL, SEO copy).
// The deploy domain is finalized when the Vercel URL is known — update `url`.

export const site = {
  name: "gjs-select",
  tagline: "The Select shadcn/ui is missing",
  description:
    "A feature-complete, accessible Select and combobox for React and shadcn/ui — single, multi-select, and tags modes, built-in search, virtualized lists, and antd-grade behavior. Install by copy-paste with the shadcn CLI.",
  url: "https://gjs-select.gokhanyildiz.dev",
  github: "https://github.com/gokhanjs/gjs-select",
  author: "gokhanjs",
  keywords: [
    "react select component",
    "shadcn select",
    "shadcn select component",
    "shadcn ui select",
    "shadcn ui multi select",
    "shadcn multiselect",
    "shadcn combobox",
    "antd select alternative",
    "ant design select",
    "accessible react select",
    "virtualized react select",
    "react combobox",
    "react multi select",
    "tags input react",
    "tailwind select component",
  ],
  get registry() {
    return `${this.url}/r/gjs-select.json`
  },
  get installCmd() {
    return `npx shadcn@latest add ${this.url}/r/gjs-select.json`
  },
} as const
