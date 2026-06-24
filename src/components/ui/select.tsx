"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Popover } from "radix-ui"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Check, ChevronDown, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type SelectValue = string | number

export interface SelectOption<V extends SelectValue = string> {
  label: React.ReactNode
  value: V
  disabled?: boolean
  className?: string
  [key: string]: unknown
}

export interface SelectOptGroup<V extends SelectValue = string> {
  label: React.ReactNode
  options: SelectOption<V>[]
}

export type SelectItem<V extends SelectValue = string> =
  | SelectOption<V>
  | SelectOptGroup<V>

export interface TagRenderProps<V extends SelectValue = string> {
  label: React.ReactNode
  value: V
  disabled: boolean
  closable: boolean
  onClose: (e: React.MouseEvent) => void
}

/** Imperative handle exposed via ref — mirrors antd's BaseSelectRef. */
export interface SelectRef {
  focus: (options?: FocusOptions) => void
  blur: () => void
  scrollTo: (index: number) => void
  nativeElement: HTMLDivElement | null
}

export interface SelectProps<V extends SelectValue = string> {
  value?: V | V[] | null
  defaultValue?: V | V[] | null
  onChange?: (
    value: V | V[] | null,
    option: SelectOption<V> | SelectOption<V>[] | null,
  ) => void
  options?: SelectItem<V>[]
  mode?: "multiple" | "tags"
  showSearch?: boolean
  searchValue?: string
  defaultSearchValue?: string
  onSearch?: (value: string) => void
  filterOption?: boolean | ((inputValue: string, option: SelectOption<V>) => boolean)
  optionFilterProp?: string
  placeholder?: React.ReactNode
  notFoundContent?: React.ReactNode
  loading?: boolean
  disabled?: boolean
  allowClear?: boolean
  size?: "small" | "middle" | "large"
  status?: "error" | "warning"
  variant?: "outlined" | "filled" | "borderless"
  maxTagCount?: number | "responsive"
  maxTagPlaceholder?: React.ReactNode | ((omitted: SelectOption<V>[]) => React.ReactNode)
  tagRender?: (props: TagRenderProps<V>) => React.ReactElement
  optionRender?: (option: SelectOption<V>, info: { index: number }) => React.ReactNode
  labelRender?: (props: { label: React.ReactNode; value: V }) => React.ReactNode
  dropdownRender?: (menu: React.ReactElement) => React.ReactElement
  onSelect?: (value: V, option: SelectOption<V>) => void
  onDeselect?: (value: V, option: SelectOption<V>) => void
  onClear?: () => void
  onFocus?: React.FocusEventHandler<HTMLDivElement>
  onBlur?: React.FocusEventHandler<HTMLDivElement>
  onDropdownVisibleChange?: (open: boolean) => void
  open?: boolean
  defaultOpen?: boolean
  className?: string
  style?: React.CSSProperties
  dropdownClassName?: string
  dropdownStyle?: React.CSSProperties
  suffixIcon?: React.ReactNode
  clearIcon?: React.ReactNode
  removeIcon?: React.ReactNode
  menuItemSelectedIcon?: React.ReactNode
  labelInValue?: boolean
  fieldNames?: { label?: string; value?: string; options?: string }
  placement?: "bottom" | "top" | "bottomLeft" | "bottomRight" | "topLeft" | "topRight"
  popupMatchSelectWidth?: boolean | number
  listHeight?: number
  virtual?: boolean
  autoClearSearchValue?: boolean
  id?: string
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-invalid"?: boolean
  "aria-describedby"?: string
  "data-testid"?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isOptGroup<V extends SelectValue>(item: SelectItem<V>): item is SelectOptGroup<V> {
  return "options" in item && Array.isArray((item as SelectOptGroup<V>).options)
}

function normalizeItems<V extends SelectValue>(
  items: SelectItem<V>[],
  fieldNames?: SelectProps<V>["fieldNames"],
): SelectItem<V>[] {
  if (!fieldNames) return items
  const lk = fieldNames.label ?? "label"
  const vk = fieldNames.value ?? "value"
  const ok = fieldNames.options ?? "options"
  return items.map((raw) => {
    const r = raw as Record<string, unknown>
    if (Array.isArray(r[ok])) {
      return {
        label: r[lk] as React.ReactNode,
        options: (r[ok] as Record<string, unknown>[]).map((o) => ({
          ...o,
          label: o[lk] as React.ReactNode,
          value: o[vk] as V,
        })),
      } as SelectOptGroup<V>
    }
    return { ...raw, label: r[lk] as React.ReactNode, value: r[vk] as V } as SelectOption<V>
  })
}

function flattenOptions<V extends SelectValue>(items: SelectItem<V>[]): SelectOption<V>[] {
  return items.flatMap((item) => (isOptGroup(item) ? item.options : [item]))
}

function nodeToString(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(nodeToString).join("")
  return ""
}

const SIDE_ALIGN: Record<
  NonNullable<SelectProps["placement"]>,
  { side: "top" | "bottom"; align: "start" | "center" | "end" }
> = {
  bottom: { side: "bottom", align: "center" },
  bottomLeft: { side: "bottom", align: "start" },
  bottomRight: { side: "bottom", align: "end" },
  top: { side: "top", align: "center" },
  topLeft: { side: "top", align: "start" },
  topRight: { side: "top", align: "end" },
}

// ─── CVA ──────────────────────────────────────────────────────────────────────

const triggerVariants = cva(
  [
    "relative flex w-full min-w-0 cursor-default flex-wrap items-center gap-1",
    "rounded-md border text-sm transition-colors duration-150 outline-none",
    "focus-within:ring-3 focus-within:ring-ring/50",
  ].join(" "),
  {
    variants: {
      variant: {
        outlined: "border-border bg-background focus-within:border-ring",
        filled: "border-transparent bg-muted focus-within:bg-background focus-within:border-ring",
        borderless: "border-transparent bg-transparent shadow-none focus-within:ring-0",
      },
      size: {
        small: "min-h-6 px-2 py-0.5 text-xs",
        middle: "min-h-8 px-3 py-1",
        large: "min-h-10 px-3 py-2 text-base",
      },
      status: {
        none: "",
        error: "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
        warning: "border-yellow-500 focus-within:border-yellow-500 focus-within:ring-yellow-500/20",
      },
    },
    defaultVariants: { variant: "outlined", size: "middle", status: "none" },
  },
)

// ─── SelectTag ────────────────────────────────────────────────────────────────

function SelectTag({
  label,
  disabled = false,
  onClose,
  removeIcon,
  size = "middle",
}: {
  label: React.ReactNode
  disabled?: boolean
  onClose: (e: React.MouseEvent) => void
  removeIcon?: React.ReactNode
  size?: "small" | "middle" | "large"
}) {
  return (
    <span
      data-gjs-select-tag=""
      data-disabled={disabled || undefined}
      className={cn(
        "gjs-select-tag inline-flex max-w-[160px] shrink-0 items-center gap-0.5 rounded",
        "border border-border bg-muted pl-1.5 text-foreground",
        size === "small" ? "pr-0.5 text-xs leading-4" : "pr-1 leading-5",
        size === "large" && "text-sm leading-6",
        disabled && "opacity-50",
      )}
    >
      <span className="truncate">{label}</span>
      {!disabled && (
        <span
          data-gjs-select-tag-close=""
          role="button"
          aria-label="Remove"
          tabIndex={-1}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClose(e)
          }}
          className="gjs-select-tag-close inline-flex size-3.5 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
        >
          {removeIcon ?? <X className="size-full" />}
        </span>
      )}
    </span>
  )
}

// ─── OptionList ───────────────────────────────────────────────────────────────
//
// Single source of truth for the dropdown list. Renders windowed (react-virtual)
// when `virtual`, otherwise materialises every row — but the keyboard, active
// state, and a11y wiring are identical for both, so there is no second code
// path to drift. Exposes a keyboard handler + scroll control via ref so the
// search input (and the list itself) can drive navigation, the way antd wires
// its input to the option list.

export interface OptionListHandle {
  keyDown: (e: React.KeyboardEvent) => void
  scrollToIndex: (index: number) => void
}

type VirtualRow<V extends SelectValue> =
  | { kind: "group"; label: React.ReactNode }
  | { kind: "option"; option: SelectOption<V>; flatIndex: number }

interface OptionListProps<V extends SelectValue> {
  items: SelectItem<V>[]
  selectedValues: V[]
  isMultiple: boolean
  onSelect: (opt: SelectOption<V>) => void
  virtual: boolean
  listHeight: number
  itemHeight: number
  optionRender?: SelectProps<V>["optionRender"]
  menuItemSelectedIcon?: React.ReactNode
  defaultActiveFirstOption: boolean
  listboxId: string
  optionId: (v: V) => string
  onActiveIdChange: (id: string | undefined) => void
}

function OptionListInner<V extends SelectValue>(
  {
    items,
    selectedValues,
    isMultiple,
    onSelect,
    virtual,
    listHeight,
    itemHeight,
    optionRender,
    menuItemSelectedIcon,
    defaultActiveFirstOption,
    listboxId,
    optionId,
    onActiveIdChange,
  }: OptionListProps<V>,
  ref: React.Ref<OptionListHandle>,
) {
  const rows = React.useMemo<VirtualRow<V>[]>(() => {
    let fi = 0
    return items.flatMap((item): VirtualRow<V>[] => {
      if (isOptGroup(item)) {
        return [
          { kind: "group", label: item.label },
          ...item.options.map((opt): VirtualRow<V> => ({ kind: "option", option: opt, flatIndex: fi++ })),
        ]
      }
      return [{ kind: "option", option: item as SelectOption<V>, flatIndex: fi++ }]
    })
  }, [items])

  const optionRows = React.useMemo(
    () => rows.filter((r): r is Extract<VirtualRow<V>, { kind: "option" }> => r.kind === "option"),
    [rows],
  )

  // Index of an optionRow within `rows` (for scrolling the virtualizer).
  const rowIndexOf = React.useCallback(
    (optIdx: number) => rows.findIndex((r) => r.kind === "option" && r.flatIndex === optionRows[optIdx]?.flatIndex),
    [rows, optionRows],
  )

  const firstEnabled = React.useCallback(() => {
    const i = optionRows.findIndex((r) => !r.option.disabled)
    return i === -1 ? null : i
  }, [optionRows])

  const [activeIdx, setActiveIdx] = React.useState<number | null>(null)
  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => (rows[i].kind === "group" ? 28 : itemHeight),
    overscan: 8,
    enabled: virtual,
  })

  const scrollToOptIdx = React.useCallback(
    (optIdx: number) => {
      if (!virtual) {
        const el = parentRef.current?.querySelector<HTMLElement>(`[data-opt-idx="${optIdx}"]`)
        el?.scrollIntoView({ block: "nearest" })
        return
      }
      const ri = rowIndexOf(optIdx)
      if (ri >= 0) virtualizer.scrollToIndex(ri, { align: "auto" })
    },
    [virtual, rowIndexOf, virtualizer],
  )

  // Reset active option whenever the visible set changes (e.g. after a search).
  React.useEffect(() => {
    setActiveIdx(defaultActiveFirstOption ? firstEnabled() : null)
  }, [defaultActiveFirstOption, firstEnabled])

  // Publish the active option id up to the combobox (aria-activedescendant).
  React.useEffect(() => {
    if (activeIdx === null) {
      onActiveIdChange(undefined)
    } else {
      const row = optionRows[activeIdx]
      onActiveIdChange(row ? optionId(row.option.value) : undefined)
    }
  }, [activeIdx, optionRows, optionId, onActiveIdChange])

  const move = React.useCallback(
    (dir: 1 | -1) => {
      setActiveIdx((prev) => {
        const n = optionRows.length
        if (n === 0) return null
        let i = prev === null ? (dir > 0 ? -1 : 0) : prev
        for (let step = 0; step < n; step++) {
          i = (i + dir + n) % n
          if (!optionRows[i].option.disabled) {
            scrollToOptIdx(i)
            return i
          }
        }
        return prev
      })
    },
    [optionRows, scrollToOptIdx],
  )

  const keyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        move(1)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        move(-1)
      } else if (e.key === "Enter") {
        if (activeIdx !== null) {
          const row = optionRows[activeIdx]
          if (row && !row.option.disabled) {
            e.preventDefault()
            onSelect(row.option)
          }
        }
      }
    },
    [move, activeIdx, optionRows, onSelect],
  )

  React.useImperativeHandle(ref, () => ({
    keyDown,
    scrollToIndex: scrollToOptIdx,
  }), [keyDown, scrollToOptIdx])

  const renderOption = (option: SelectOption<V>, flatIndex: number, optIdx: number) => {
    const isSelected = selectedValues.includes(option.value)
    const isActive = activeIdx === optIdx
    return (
      <div
        key={String(option.value)}
        id={optionId(option.value)}
        data-gjs-select-option=""
        data-opt-idx={optIdx}
        data-selected={isSelected || undefined}
        data-active={isActive || undefined}
        data-disabled={option.disabled || undefined}
        role="option"
        aria-selected={isActive}
        aria-disabled={option.disabled || undefined}
        className={cn(
          "gjs-select-option flex cursor-default select-none items-center gap-2 px-2 py-1.5 text-sm outline-none transition-colors",
          !option.disabled && "hover:bg-accent hover:text-accent-foreground",
          isActive && "bg-accent text-accent-foreground",
          // Disabled: use the contrast-tuned muted token (≥4.5:1) rather than an
          // opacity fade, which would drop below WCAG 1.4.3 minimum contrast.
          option.disabled && "pointer-events-none text-muted-foreground",
          option.className,
        )}
        onMouseEnter={() => !option.disabled && setActiveIdx(optIdx)}
        onMouseDown={(e) => {
          e.preventDefault()
          if (!option.disabled) onSelect(option)
        }}
      >
        {optionRender ? (
          optionRender(option, { index: flatIndex })
        ) : (
          <>
            {isMultiple && (
              <span
                data-gjs-select-option-check=""
                className={cn(
                  "gjs-select-option-check inline-flex size-4 shrink-0 items-center justify-center",
                  "rounded border border-border transition-colors",
                  isSelected && "border-primary bg-primary text-primary-foreground",
                )}
              >
                {isSelected && <Check className="size-3" />}
              </span>
            )}
            <span className="flex-1 truncate">{option.label}</span>
            {!isMultiple && isSelected && (
              <span
                data-gjs-select-option-check=""
                className="gjs-select-option-check ml-auto shrink-0 text-primary"
              >
                {menuItemSelectedIcon ?? <Check className="size-4" />}
              </span>
            )}
          </>
        )}
      </div>
    )
  }

  const renderGroupLabel = (label: React.ReactNode, key: React.Key) => (
    <div
      key={key}
      data-gjs-select-option-group-label=""
      className="gjs-select-option-group-label flex items-center px-2 py-1 text-xs font-medium text-muted-foreground"
    >
      {label}
    </div>
  )

  // Common container attributes for both windowed and full rendering.
  const listProps = {
    ref: parentRef,
    id: listboxId,
    role: "listbox" as const,
    "aria-multiselectable": isMultiple || undefined,
    tabIndex: 0,
    onKeyDown: keyDown,
  }

  if (virtual) {
    return (
      <div
        {...listProps}
        data-gjs-select-virtual-list=""
        className="gjs-select-virtual-list overflow-y-auto overscroll-contain focus-visible:outline-none"
        style={{ height: listHeight }}
      >
        <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
          {virtualizer.getVirtualItems().map((vItem) => {
            const row = rows[vItem.index]
            const style: React.CSSProperties = {
              position: "absolute",
              top: vItem.start,
              left: 0,
              right: 0,
              height: vItem.size,
            }
            if (row.kind === "group") {
              return (
                <div key={vItem.key} style={style}>
                  {renderGroupLabel(row.label, vItem.key)}
                </div>
              )
            }
            const optIdx = optionRows.findIndex((r) => r.flatIndex === row.flatIndex)
            return (
              <div key={vItem.key} style={style}>
                {renderOption(row.option, row.flatIndex, optIdx)}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Non-virtual: render every row in real DOM (no windowing) so small lists keep
  // all options present in the DOM (no off-screen culling).
  let optCursor = 0
  return (
    <div
      {...listProps}
      data-gjs-select-list=""
      className="gjs-select-list overflow-y-auto overscroll-contain focus-visible:outline-none"
      style={{ maxHeight: listHeight }}
    >
      {rows.map((row, i) =>
        row.kind === "group"
          ? renderGroupLabel(row.label, `g${i}`)
          : renderOption(row.option, row.flatIndex, optCursor++),
      )}
    </div>
  )
}

const OptionList = React.forwardRef(OptionListInner) as <V extends SelectValue>(
  props: OptionListProps<V> & { ref?: React.Ref<OptionListHandle> },
) => React.ReactElement

// ─── Select ───────────────────────────────────────────────────────────────────

function SelectInner<V extends SelectValue = string>(
  {
    value: valueProp,
    defaultValue,
    onChange,
    options: optionsProp = [],
    mode,
    showSearch: showSearchProp,
    searchValue: searchValueProp,
    defaultSearchValue = "",
    onSearch,
    filterOption,
    optionFilterProp = "label",
    placeholder = "Select...",
    notFoundContent = "No options",
    loading = false,
    disabled = false,
    allowClear = false,
    size = "middle",
    status,
    variant = "outlined",
    maxTagCount,
    maxTagPlaceholder,
    tagRender,
    optionRender,
    labelRender,
    dropdownRender,
    onSelect: onSelectProp,
    onDeselect: onDeselectProp,
    onClear,
    onFocus,
    onBlur,
    onDropdownVisibleChange,
    open: openProp,
    defaultOpen = false,
    className,
    style,
    dropdownClassName,
    dropdownStyle,
    suffixIcon,
    clearIcon,
    removeIcon,
    menuItemSelectedIcon,
    labelInValue = false,
    fieldNames,
    placement = "bottomLeft",
    popupMatchSelectWidth = true,
    listHeight = 256,
    virtual = false,
    autoClearSearchValue = true,
    id,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedby,
    "data-testid": dataTestId,
  }: SelectProps<V>,
  ref: React.Ref<SelectRef>,
) {
  const isMultiple = mode === "multiple" || mode === "tags"
  const showSearch = showSearchProp ?? isMultiple

  // ── Open state ──────────────────────────────────────────────────────────────
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const open = openProp !== undefined ? openProp : internalOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next)
      onDropdownVisibleChange?.(next)
      if (!next && autoClearSearchValue && searchValueProp === undefined) {
        setInternalSearch("")
      }
    },
    [openProp, onDropdownVisibleChange, autoClearSearchValue, searchValueProp],
  )

  // ── Search state ────────────────────────────────────────────────────────────
  const [internalSearch, setInternalSearch] = React.useState(defaultSearchValue)
  const searchValue = searchValueProp !== undefined ? searchValueProp : internalSearch

  // ── Value state ─────────────────────────────────────────────────────────────
  const toArray = React.useCallback((v: V | V[] | null | undefined): V[] => {
    if (v == null) return []
    if (Array.isArray(v)) return v
    if (labelInValue && typeof v === "object") return [(v as { value: V }).value]
    return [v]
  }, [labelInValue])

  const [internalValue, setInternalValue] = React.useState<V[]>(toArray(defaultValue))
  const selectedValues = valueProp !== undefined ? toArray(valueProp) : internalValue

  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const optionListRef = React.useRef<OptionListHandle>(null)
  const tagsAreaRef = React.useRef<HTMLDivElement>(null)
  const [responsiveMax, setResponsiveMax] = React.useState<number>(9999)

  // ── A11y IDs ────────────────────────────────────────────────────────────────
  const baseId = React.useId()
  const listboxId = `${baseId}lb`
  const optId = React.useCallback((v: V): string => `${baseId}opt${String(v)}`, [baseId])
  const [activeDescendant, setActiveDescendant] = React.useState<string | undefined>()

  // ── Imperative handle (antd BaseSelectRef parity) ─────────────────────────────
  React.useImperativeHandle(ref, () => ({
    focus: (options) => triggerRef.current?.focus(options),
    blur: () => triggerRef.current?.blur(),
    scrollTo: (index) => optionListRef.current?.scrollToIndex(index),
    nativeElement: triggerRef.current,
  }), [])

  // ── Options ─────────────────────────────────────────────────────────────────
  const normalizedOptions = React.useMemo(
    () => normalizeItems<V>(optionsProp as SelectItem<V>[], fieldNames),
    [optionsProp, fieldNames],
  )

  const allFlat = React.useMemo(() => flattenOptions(normalizedOptions), [normalizedOptions])

  const allFlatMap = React.useMemo(
    () => new Map<V, SelectOption<V>>(allFlat.map((o) => [o.value, o])),
    [allFlat],
  )

  const filteredOptions = React.useMemo((): SelectItem<V>[] => {
    if (!searchValue) return normalizedOptions
    const defaultFilter = (input: string, opt: SelectOption<V>) => {
      const prop =
        optionFilterProp === "label"
          ? nodeToString(opt.label)
          : String((opt as Record<string, unknown>)[optionFilterProp] ?? "")
      return prop.toLowerCase().includes(input.toLowerCase())
    }
    const filter =
      filterOption === false
        ? () => true
        : typeof filterOption === "function"
          ? filterOption
          : defaultFilter
    const run = (items: SelectItem<V>[]): SelectItem<V>[] => {
      const result: SelectItem<V>[] = []
      for (const item of items) {
        if (isOptGroup(item)) {
          const opts = item.options.filter((o) => filter(searchValue, o))
          if (opts.length) result.push({ ...item, options: opts })
        } else if (filter(searchValue, item)) {
          result.push(item)
        }
      }
      return result
    }
    return run(normalizedOptions)
  }, [normalizedOptions, searchValue, filterOption, optionFilterProp])

  // Clear the active descendant when the popup closes or has no matches (an
  // empty list unmounts OptionList, so it cannot clear it itself).
  React.useEffect(() => {
    if (!open || filteredOptions.length === 0) setActiveDescendant(undefined)
  }, [open, filteredOptions.length])

  // ── Responsive maxTagCount ──────────────────────────────────────────────────
  React.useLayoutEffect(() => {
    if (maxTagCount !== "responsive") return
    const area = tagsAreaRef.current
    if (!area) return
    const measure = () => {
      const avail = area.clientWidth - 52
      let used = 0
      let count = 0
      const tagEls = area.querySelectorAll<HTMLElement>("[data-gjs-select-tag]")
      for (const el of tagEls) {
        used += el.offsetWidth + 4
        if (used <= avail) count++
        else break
      }
      setResponsiveMax(Math.max(count, 1))
    }
    const ro = new ResizeObserver(measure)
    ro.observe(area)
    measure()
    return () => ro.disconnect()
  }, [maxTagCount, selectedValues.length])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const commitChange = React.useCallback(
    (next: V[], matched: (SelectOption<V> | undefined)[]) => {
      if (valueProp === undefined) setInternalValue(next)
      const clean = matched.filter((o): o is SelectOption<V> => o !== undefined)
      const raw: V | V[] | null = isMultiple ? next : next[0] ?? null
      if (labelInValue) {
        const lv = isMultiple
          ? clean.map((o) => ({ label: o.label, value: o.value }))
          : clean[0]
            ? { label: clean[0].label, value: clean[0].value }
            : null
        onChange?.(lv as V | V[] | null, isMultiple ? clean : clean[0] ?? null)
      } else {
        onChange?.(raw, isMultiple ? clean : clean[0] ?? null)
      }
    },
    [valueProp, isMultiple, labelInValue, onChange],
  )

  const handleSelect = React.useCallback(
    (option: SelectOption<V>) => {
      if (option.disabled) return
      let next: V[]
      if (isMultiple) {
        if (selectedValues.includes(option.value)) {
          next = selectedValues.filter((v) => v !== option.value)
          onDeselectProp?.(option.value, option)
        } else {
          next = [...selectedValues, option.value]
          onSelectProp?.(option.value, option)
        }
      } else {
        next = [option.value]
        onSelectProp?.(option.value, option)
        setOpen(false)
      }
      const matched = next.map((v) => allFlatMap.get(v))
      commitChange(next, matched)
      if (autoClearSearchValue && isMultiple && searchValueProp === undefined) {
        setInternalSearch("")
      }
    },
    [
      isMultiple, selectedValues, allFlatMap, onSelectProp, onDeselectProp,
      autoClearSearchValue, searchValueProp, commitChange, setOpen,
    ],
  )

  const removeValue = React.useCallback(
    (value: V) => {
      const option = allFlatMap.get(value)
      if (!option || option.disabled) return
      const next = selectedValues.filter((v) => v !== value)
      onDeselectProp?.(value, option)
      commitChange(next, next.map((v) => allFlatMap.get(v)))
    },
    [selectedValues, allFlatMap, onDeselectProp, commitChange],
  )

  const handleDeselect = React.useCallback(
    (value: V, e: React.MouseEvent) => {
      e.stopPropagation()
      removeValue(value)
    },
    [removeValue],
  )

  const removeLastTag = React.useCallback(() => {
    if (!isMultiple || selectedValues.length === 0 || disabled) return
    removeValue(selectedValues[selectedValues.length - 1])
  }, [isMultiple, selectedValues, disabled, removeValue])

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (valueProp === undefined) setInternalValue([])
      if (searchValueProp === undefined) setInternalSearch("")
      onClear?.()
      onChange?.(isMultiple ? ([] as V[]) : null, isMultiple ? [] : null)
    },
    [valueProp, searchValueProp, onClear, onChange, isMultiple],
  )

  const handleSearch = React.useCallback(
    (value: string) => {
      if (searchValueProp === undefined) setInternalSearch(value)
      onSearch?.(value)
    },
    [searchValueProp, onSearch],
  )

  const handleTagsEnter = React.useCallback(() => {
    if (mode !== "tags" || !searchValue.trim()) return
    const existing = allFlat.find(
      (o) => nodeToString(o.label).toLowerCase() === searchValue.toLowerCase(),
    )
    const newValue = (searchValue as SelectValue) as V
    handleSelect(existing ?? { label: searchValue, value: newValue })
  }, [mode, searchValue, allFlat, handleSelect])

  const handleSearchKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        optionListRef.current?.keyDown(e)
      } else if (e.key === "Enter") {
        // An open option list claims Enter to pick the active option; with no
        // matches (tags mode) Enter turns the typed text into a new tag.
        if (filteredOptions.length > 0) optionListRef.current?.keyDown(e)
        else handleTagsEnter()
      } else if (e.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      } else if (e.key === "Backspace" && searchValue === "" && isMultiple) {
        removeLastTag()
      }
    },
    [filteredOptions.length, handleTagsEnter, setOpen, searchValue, isMultiple, removeLastTag],
  )

  const handleTriggerKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 0)
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 0)
      } else if (e.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      } else if (e.key === "Backspace" && isMultiple && !open) {
        e.preventDefault()
        removeLastTag()
      }
    },
    [disabled, isMultiple, open, setOpen, removeLastTag],
  )

  // ── Derived ──────────────────────────────────────────────────────────────────
  const allTags = React.useMemo(
    () =>
      isMultiple
        ? selectedValues.map((v) => {
            const opt = allFlatMap.get(v)
            return { value: v, label: opt?.label ?? String(v), disabled: opt?.disabled ?? false }
          })
        : [],
    [isMultiple, selectedValues, allFlatMap],
  )

  const effectiveMax =
    maxTagCount === "responsive"
      ? responsiveMax
      : typeof maxTagCount === "number"
        ? maxTagCount
        : undefined

  const visibleTags = effectiveMax !== undefined ? allTags.slice(0, effectiveMax) : allTags
  const overflowTags = effectiveMax !== undefined ? allTags.slice(effectiveMax) : []

  const hasValue = selectedValues.length > 0
  const showClear = allowClear && hasValue && !disabled && !loading

  const singleLabel = React.useMemo(() => {
    if (isMultiple) return null
    const opt = allFlatMap.get(selectedValues[0])
    if (!opt) return null
    return labelRender ? labelRender({ label: opt.label, value: opt.value }) : opt.label
  }, [isMultiple, allFlatMap, selectedValues, labelRender])

  const { side, align } = SIDE_ALIGN[placement]
  const itemHeight = size === "small" ? 26 : size === "large" ? 40 : 32

  // ── Dropdown menu ─────────────────────────────────────────────────────────────
  const menuEl: React.ReactElement = (
    <div data-gjs-select-menu="" className="flex flex-col">
      <div
        data-gjs-select-search-wrapper=""
        className={cn(
          "gjs-select-search-wrapper flex items-center border-b border-border px-3",
          // Keep the input mounted + focusable even when search is off (WCAG
          // 2.1.1): h-0/overflow-hidden hides it visually without display:none.
          !showSearch && !isMultiple && "h-0 overflow-hidden border-b-0 px-0",
        )}
      >
        <input
          ref={searchInputRef}
          data-gjs-select-search=""
          className="gjs-select-search h-9 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Search..."
          aria-label="Search"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>
      {filteredOptions.length === 0 ? (
        <div
          data-gjs-select-empty=""
          className="gjs-select-empty py-6 text-center text-sm text-muted-foreground"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Loading…
            </span>
          ) : (
            notFoundContent
          )}
        </div>
      ) : (
        <OptionList<V>
          ref={optionListRef}
          items={filteredOptions}
          selectedValues={selectedValues}
          isMultiple={isMultiple}
          onSelect={handleSelect}
          virtual={virtual}
          listHeight={listHeight}
          itemHeight={itemHeight}
          optionRender={optionRender}
          menuItemSelectedIcon={menuItemSelectedIcon}
          defaultActiveFirstOption
          listboxId={listboxId}
          optionId={optId}
          onActiveIdChange={setActiveDescendant}
        />
      )}
    </div>
  )

  const dropdownContent = dropdownRender ? dropdownRender(menuEl) : menuEl

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Popover.Root open={open} onOpenChange={(next) => !disabled && setOpen(next)}>
      <Popover.Anchor asChild>
        <div
          ref={(node) => {
            tagsAreaRef.current = node
            triggerRef.current = node
          }}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={activeDescendant}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-invalid={ariaInvalid || undefined}
          aria-describedby={ariaDescribedby}
          aria-disabled={disabled || undefined}
          data-testid={dataTestId}
          data-gjs-select-trigger=""
          data-disabled={disabled || undefined}
          data-open={open || undefined}
          data-status={status || undefined}
          data-size={size}
          data-mode={mode || undefined}
          tabIndex={disabled ? -1 : 0}
          style={style}
          className={cn(
            triggerVariants({ variant, size, status: status ?? "none" }),
            disabled && "cursor-not-allowed opacity-50 pointer-events-none",
            className,
          )}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={handleTriggerKeyDown}
          onClick={() => {
            if (!disabled) setOpen(!open)
          }}
        >
          {isMultiple &&
            visibleTags.map(({ value, label, disabled: td }) =>
              tagRender ? (
                tagRender({
                  label,
                  value,
                  disabled: td || disabled,
                  closable: !disabled,
                  onClose: (e) => handleDeselect(value, e),
                })
              ) : (
                <SelectTag
                  key={String(value)}
                  label={label}
                  disabled={td || disabled}
                  onClose={(e) => handleDeselect(value, e)}
                  removeIcon={removeIcon}
                  size={size}
                />
              ),
            )}

          {overflowTags.length > 0 && (
            <span
              data-gjs-select-overflow-tag=""
              className="gjs-select-overflow-tag inline-flex shrink-0 items-center rounded border border-border bg-muted px-1.5 text-xs text-muted-foreground"
            >
              {maxTagPlaceholder
                ? typeof maxTagPlaceholder === "function"
                  ? maxTagPlaceholder(
                      overflowTags.map(({ value, label }) => ({ label, value }) as SelectOption<V>),
                    )
                  : maxTagPlaceholder
                : `+${overflowTags.length}`}
            </span>
          )}

          {!isMultiple && (
            <span
              data-gjs-select-value=""
              className={cn(
                "gjs-select-value flex-1 truncate",
                !hasValue && "text-muted-foreground",
              )}
            >
              {hasValue ? singleLabel : placeholder}
            </span>
          )}

          {isMultiple && selectedValues.length === 0 && (
            <span
              data-gjs-select-placeholder=""
              className="gjs-select-placeholder pointer-events-none flex-1 text-muted-foreground"
            >
              {placeholder}
            </span>
          )}

          <span
            data-gjs-select-suffix=""
            className="gjs-select-suffix ml-auto flex shrink-0 items-center gap-1 pl-1"
          >
            {loading && (
              <Loader2
                data-gjs-select-loading=""
                className="gjs-select-loading size-4 animate-spin text-muted-foreground"
              />
            )}
            {showClear && (
              <span
                data-gjs-select-clear=""
                role="button"
                aria-label="Clear selection"
                onMouseDown={handleClear}
                className="gjs-select-clear inline-flex cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {clearIcon ?? <X className="size-3.5" />}
              </span>
            )}
            <span
              data-gjs-select-arrow=""
              aria-hidden
              className={cn(
                "gjs-select-arrow inline-flex items-center text-muted-foreground transition-transform duration-200",
                open && "rotate-180",
              )}
            >
              {suffixIcon ?? <ChevronDown className="size-4" />}
            </span>
          </span>
        </div>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          data-gjs-select-dropdown=""
          side={side}
          align={align}
          sideOffset={4}
          avoidCollisions
          collisionPadding={8}
          style={{
            width:
              popupMatchSelectWidth === true
                ? "var(--radix-popover-trigger-width)"
                : typeof popupMatchSelectWidth === "number"
                  ? popupMatchSelectWidth
                  : undefined,
            ...dropdownStyle,
          }}
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            searchInputRef.current?.focus()
          }}
          onPointerDownOutside={(e) => {
            if (tagsAreaRef.current?.contains(e.target as Node)) {
              e.preventDefault()
            }
          }}
          className={cn(
            "gjs-select-dropdown",
            "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border",
            "bg-popover text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            dropdownClassName,
          )}
        >
          {dropdownContent}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export const Select = React.forwardRef(SelectInner) as <V extends SelectValue = string>(
  props: SelectProps<V> & { ref?: React.Ref<SelectRef> },
) => React.ReactElement
