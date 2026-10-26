# Changelog

All notable changes to gjs-select are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-10-26

### Added

- `locale` prop for the built-in texts: `{ clear?, search?, remove?, loading? }`
  sets the clear button, search input, and tag remove `aria-label`s and the
  loading text. Every key falls back to its English default, so existing usage
  is unchanged. `notFoundContent` stays a separate prop for antd parity.

### Fixed

- Single select opens with the selected option highlighted and scrolled into
  view (virtual lists included), so ArrowDown moves to the next option instead
  of the second one. Multiple mode still starts on the first enabled option,
  matching antd.
- The dropdown no longer opens wider than a narrow trigger: `min-w-32` now
  applies only when `popupMatchSelectWidth` is not `true`.

### Changed

- Without `showSearch`, the hidden read-only search input is no longer rendered.
  Focus stays on the combobox, which drives the list via
  `aria-activedescendant`; screen readers no longer announce a "Search" field.
  Styles or tests that target `[data-gjs-select-search]` on a non-searchable
  select need updating.
- The documentation site's form demos build against zod 4. `zod` is a demo-only
  dependency, so `gjs-select.tsx` and the distributed registry component are
  unaffected.

### Security

- Updated dependencies to clear 43 open Dependabot advisories (22 high, 20
  moderate, 1 low). Next.js moves from 16.2.9 to 16.3.3, and the transitive
  `postcss`, `nanoid`, `sharp`, `undici`, `js-yaml`, `fast-uri`, `ip-address`,
  `brace-expansion`, and `hono` trees are refreshed to patched versions.
- Updated dependencies to clear 54 open advisories (4 critical, 19 high, 25
  moderate, 6 low). Next.js moves from 16.3.3 to 16.4.2, React to 19.3.1, and
  radix-ui to 1.8.1; the transitive `body-parser`, `brace-expansion`, and
  `source-map-js` trees are refreshed to patched versions.

## [1.0.2] - 2026-06-27

### Fixed

- Multi-select no longer overflows its container in flex/grid layouts. The tag
  wrap area used a percentage flex-basis (`flex-1`), which resolves to
  max-content during intrinsic sizing and inflated `min-width:auto` parents
  (also breaking responsive tag collapse). It now pins a definite zero basis
  (`w-0`), so the control stays within the available width while flex-grow fills
  it — no per-usage `min-w-0` workaround needed.

## [1.0.1] - 2026-06-26

### Fixed

- `aria-selected` now reflects the selected value instead of the keyboard-active
  row, so screen readers announce the real selection rather than the highlighted
  option (the active option is still exposed via `aria-activedescendant`).
- Controlled `labelInValue` arrays (`{ label, value }[]`) are unwrapped to their
  raw values, so selection, tag rendering, and the selected check work with
  `labelInValue` combined with `multiple`/`tags`.
- The dropdown no longer flashes from `document.body` before moving to a custom
  `getPopupContainer` when opened with `defaultOpen` (resolved before paint).

### Changed

- Virtualized option lists resolve a visible row's index in O(1) via a memoized
  lookup map instead of scanning the option list on every render frame.

## [1.0.0] - 2026-06-26

First stable release.

### Added

- Full Ant Design `Select` parity in a single shadcn/ui registry component:
  single, `multiple`, and `tags` modes.
- Built-in search, virtualized option lists (`@tanstack/react-virtual`), optgroups,
  and `maxTagCount="responsive"` tag overflow.
- Custom rendering: `optionRender`, `tagRender`, `labelRender`, `dropdownRender`.
- `labelInValue`, `fieldNames`, `maxCount`, `tokenSeparators`, three sizes,
  `variant`, `status`, prefix/suffix slots, RTL (`direction`), and an imperative
  ref (`focus`, `blur`, `scrollTo`).
- Accessible combobox semantics with full keyboard and screen-reader support.
- Install via the shadcn CLI:
  `npx shadcn@latest add https://gjs-select.gokhanyildiz.dev/r/gjs-select.json`

[1.1.0]: https://github.com/gokhanjs/gjs-select/releases/tag/v1.1.0
[1.0.2]: https://github.com/gokhanjs/gjs-select/releases/tag/v1.0.2
[1.0.1]: https://github.com/gokhanjs/gjs-select/releases/tag/v1.0.1
[1.0.0]: https://github.com/gokhanjs/gjs-select/releases/tag/v1.0.0
