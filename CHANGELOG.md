# Changelog

All notable changes to gjs-select are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.0.2]: https://github.com/gokhanjs/gjs-select/releases/tag/v1.0.2
[1.0.1]: https://github.com/gokhanjs/gjs-select/releases/tag/v1.0.1
[1.0.0]: https://github.com/gokhanjs/gjs-select/releases/tag/v1.0.0
