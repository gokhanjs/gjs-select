# Contributing to gjs-select

Thanks for your interest in improving gjs-select. The library is a single shadcn/ui
registry component — `src/components/ui/gjs-select.tsx` — that targets full Ant Design
`Select` parity, plus a Next.js docs site.

## Prerequisites

- Node.js 22+
- pnpm 10+ (run `corepack enable` to pick up the version pinned in `package.json`)

## Setup

```bash
pnpm install
pnpm dev        # docs site at http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm build` | Build the shadcn registry (`shadcn build`) and the Next.js site |
| `pnpm test` | Playwright functional suite |
| `pnpm test:all` | All Playwright projects (functional, a11y, perf, stress, patterns, visual) |

## Working on the component

Everything lives in `src/components/ui/gjs-select.tsx`. When changing it:

- Keep the public `SelectProps` API aligned with antd's `Select` where practical.
- Match the existing style: standard Tailwind scale + shadcn tokens, no arbitrary values.
- The registry is generated from `registry.json`; `pnpm build` regenerates `public/r/gjs-select.json`.
- Run `pnpm lint`, `pnpm typecheck`, and the relevant Playwright suites before opening a PR.

## Pull requests

1. Branch off `main`.
2. Keep changes focused and surgical.
3. Ensure `pnpm lint`, `pnpm typecheck`, and `pnpm build` pass — CI runs all three on every PR.
4. Use [Conventional Commits](https://www.conventionalcommits.org/) (in English) for commit messages.
5. Open the PR against `main` and fill out the template.

## Reporting bugs

Use the issue templates. A minimal reproduction (a code snippet or a sandbox link)
gets a fix much faster.
