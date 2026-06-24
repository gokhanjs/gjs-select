"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Popover } from "radix-ui"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk"
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

// ─── OptionItem (cmdk) ────────────────────────────────────────────────────────

function OptionItem<V extends SelectValue>({
  option,
  index,
  isSelected,
  isMultiple,
  onSelect,
  optionRender,
  menuItemSelectedIcon,
}: {
  option: SelectOption<V>
  index: number
  isSelected: boolean
  isMultiple: boolean
  onSelect: (opt: SelectOption<V>) => void
  optionRender?: SelectProps<V>["optionRender"]
  menuItemSelectedIcon?: React.ReactNode
}) {
  return (
    <CommandItem
      data-gjs-select-option=""
      data-selected={isSelected || undefined}
      value={String(option.value)}
      disabled={option.disabled}
      onSelect={() => onSelect(option)}
      className={cn(
        "gjs-select-option",
        "flex cursor-default select-none items-center gap-2 px-2 py-1.5 text-sm outline-none",
        "transition-colors",
        "aria-selected:bg-accent aria-selected:text-accent-foreground",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        option.className,
      )}
    >
      {optionRender ? (
        optionRender(option, { index })
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
    </CommandItem>
  )
}

// ─── VirtualList ──────────────────────────────────────────────────────────────

type VirtualRow<V extends SelectValue> =
  | { kind: "group"; label: React.ReactNode }
  | { kind: "option"; option: SelectOption<V>; flatIndex: number }

function VirtualList<V extends SelectValue>({
  items,
  selectedValues,
  isMultiple,
  onSelect,
  listHeight,
  itemHeight,
  optionRender,
  menuItemSelectedIcon,
  listboxId,
  idPrefix,
  onActiveIdChange,
}: {
  items: SelectItem<V>[]
  selectedValues: V[]
  isMultiple: boolean
  onSelect: (opt: SelectOption<V>) => void
  listHeight: number
  itemHeight: number
  optionRender?: SelectProps<V>["optionRender"]
  menuItemSelectedIcon?: React.ReactNode
  listboxId?: string
  idPrefix?: string
  onActiveIdChange?: (id: string | undefined) => void
}) {
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

  const [activeIdx, setActiveIdx] = React.useState<number | null>(null)
  const parentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!onActiveIdChange) return
    if (activeIdx === null || !idPrefix) {
      onActiveIdChange(undefined)
    } else {
      const row = optionRows[activeIdx]
      if (row) onActiveIdChange(`${idPrefix}opt${String(row.option.value)}`)
    }
  }, [activeIdx, optionRows, idPrefix, onActiveIdChange])

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => (rows[i].kind === "group" ? 28 : itemHeight),
    overscan: 5,
  })

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((prev) => {
        const next = prev === null ? 0 : Math.min(prev + 1, optionRows.length - 1)
        const rowIdx = rows.findIndex(
          (r) => r.kind === "option" && r.flatIndex === optionRows[next]?.flatIndex,
        )
        if (rowIdx >= 0) virtualizer.scrollToIndex(rowIdx, { align: "auto" })
        return next
      })
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((prev) => {
        const next = prev === null ? 0 : Math.max(prev - 1, 0)
        const rowIdx = rows.findIndex(
          (r) => r.kind === "option" && r.flatIndex === optionRows[next]?.flatIndex,
        )
        if (rowIdx >= 0) virtualizer.scrollToIndex(rowIdx, { align: "auto" })
        return next
      })
    } else if (e.key === "Enter" && activeIdx !== null) {
      const row = optionRows[activeIdx]
      if (row && !row.option.disabled) onSelect(row.option)
    }
  }

  return (
    <div
      ref={parentRef}
      id={listboxId}
      data-gjs-select-virtual-list=""
      className="gjs-select-virtual-list overflow-y-auto overscroll-contain focus-visible:outline-none"
      style={{ height: listHeight }}
      tabIndex={0}
      role="listbox"
      aria-multiselectable={isMultiple || undefined}
      onKeyDown={handleKeyDown}
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
              <div
                key={vItem.key}
                data-gjs-select-option-group-label=""
                style={style}
                className="gjs-select-option-group-label flex items-center px-2 py-1 text-xs font-medium text-muted-foreground"
              >
                {row.label}
              </div>
            )
          }
          const { option, flatIndex } = row
          const isSelected = selectedValues.includes(option.value)
          const isActive = optionRows[activeIdx ?? -1]?.flatIndex === flatIndex
          return (
            <div
              key={vItem.key}
              id={idPrefix ? `${idPrefix}opt${String(option.value)}` : undefined}
              data-gjs-select-option=""
              data-selected={isSelected || undefined}
              data-active={isActive || undefined}
              data-disabled={option.disabled || undefined}
              role="option"
              aria-selected={isSelected}
              style={style}
              className={cn(
                "gjs-select-option flex cursor-default select-none items-center gap-2 px-2 py-1.5 text-sm outline-none transition-colors",
                !option.disabled && "hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground",
                option.disabled && "pointer-events-none opacity-50",
              )}
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
        })}
      </div>
    </div>
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────

export function Select<V extends SelectValue = string>({
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
}: SelectProps<V>) {
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
    // labelInValue: extract raw value from {label,value} object
    if (labelInValue && typeof v === "object") return [(v as { value: V }).value]
    return [v]
  }, [labelInValue])

  const [internalValue, setInternalValue] = React.useState<V[]>(toArray(defaultValue))
  const selectedValues = valueProp !== undefined ? toArray(valueProp) : internalValue

  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const commandRootRef = React.useRef<HTMLDivElement>(null)
  // Responsive maxTagCount
  const tagsAreaRef = React.useRef<HTMLDivElement>(null)
  const [responsiveMax, setResponsiveMax] = React.useState<number>(9999)

  // ── A11y IDs ────────────────────────────────────────────────────────────────
  const baseId = React.useId()
  // listboxId: our controlled ID for the virtual path; cmdk path uses DOM-read ID
  const listboxId = `${baseId}lb`
  const optId = React.useCallback((v: V): string => `${baseId}opt${String(v)}`, [baseId])
  const [activeDescendant, setActiveDescendant] = React.useState<string | undefined>()
  // cmListboxId: actual ID assigned by Radix to CommandList (can't be overridden via prop)
  const [cmListboxId, setCmListboxId] = React.useState<string | undefined>()

  // For cmdk path: read actual DOM IDs after the portal mounts, then observe aria-selected
  // changes to sync the active option to aria-activedescendant on our trigger.
  // (cmdk v1 does NOT set aria-activedescendant; it marks active items with aria-selected="true")
  React.useEffect(() => {
    if (!open) {
      setActiveDescendant(undefined)
      return
    }
    let obs: MutationObserver | undefined
    // setTimeout(0) ensures the Portal has committed to the DOM and refs are attached
    const t = setTimeout(() => {
      const root = commandRootRef.current
      if (!root) return

      const listEl = root.querySelector("[data-gjs-select-list]") as HTMLElement | null
      if (listEl?.id) setCmListboxId(listEl.id)

      const syncActive = () => {
        const activeItem = root.querySelector(
          "[cmdk-item][aria-selected=true]",
        ) as HTMLElement | null
        setActiveDescendant(activeItem?.id ?? undefined)
      }

      obs = new MutationObserver(syncActive)
      obs.observe(root, { attributes: true, attributeFilter: ["aria-selected"], subtree: true })
      syncActive()
    }, 0)

    return () => {
      clearTimeout(t)
      obs?.disconnect()
    }
  }, [open])

  // ── Options ─────────────────────────────────────────────────────────────────
  const normalizedOptions = React.useMemo(
    () => normalizeItems<V>(optionsProp as SelectItem<V>[], fieldNames),
    [optionsProp, fieldNames],
  )

  const allFlat = React.useMemo(() => flattenOptions(normalizedOptions), [normalizedOptions])

  // O(1) lookup map
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

  // ── Responsive maxTagCount ──────────────────────────────────────────────────
  React.useLayoutEffect(() => {
    if (maxTagCount !== "responsive") return
    const area = tagsAreaRef.current
    if (!area) return
    const measure = () => {
      // Available width: area width minus suffix icons (~52px) minus padding
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
    // tags mode always produces string values from user input.
    // V must be `string` for mode="tags" — no unknown escape needed.
    const newValue = (searchValue as SelectValue) as V
    handleSelect(existing ?? { label: searchValue, value: newValue })
  }, [mode, searchValue, allFlat, handleSelect])

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

  // ── cmdk dropdown ────────────────────────────────────────────────────────────
  const cmMenuEl = React.useMemo((): React.ReactElement => (
    <Command
      ref={commandRootRef}
      data-gjs-select-command=""
      className="flex flex-col"
      shouldFilter={false}
      loop
    >
      <div
        data-gjs-select-search-wrapper=""
        className={cn(
          "gjs-select-search-wrapper flex items-center border-b border-border px-3",
          !showSearch && !isMultiple && "hidden",
        )}
      >
        <CommandInput
          ref={searchInputRef}
          data-gjs-select-search=""
          className="gjs-select-search h-9 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Search..."
          value={searchValue}
          onValueChange={handleSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleTagsEnter()
            if (e.key === "Escape") {
              setOpen(false)
              triggerRef.current?.focus()
            }
            if (e.key === "Backspace" && searchValue === "" && isMultiple) {
              removeLastTag()
            }
          }}
        />
      </div>
      <CommandList
        data-gjs-select-list=""
        className="gjs-select-list overflow-y-auto overscroll-contain"
        style={{ maxHeight: listHeight }}
      >
        {filteredOptions.length === 0 && (
          <CommandEmpty
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
          </CommandEmpty>
        )}
        {filteredOptions.map((item, gi) =>
          isOptGroup(item) ? (
            <CommandGroup
              key={gi}
              data-gjs-select-option-group=""
              heading={item.label}
              className={cn(
                "gjs-select-option-group",
                "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5",
                "[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
                "[&_[cmdk-group-heading]]:text-muted-foreground",
              )}
            >
              {item.options.map((opt, oi) => (
                <OptionItem
                  key={String(opt.value)}
                  option={opt}
                  index={oi}
                  isSelected={selectedValues.includes(opt.value)}
                  isMultiple={isMultiple}
                  onSelect={handleSelect}
                  optionRender={optionRender}
                  menuItemSelectedIcon={menuItemSelectedIcon}
                />
              ))}
            </CommandGroup>
          ) : (
            <OptionItem
              key={String(item.value)}
              option={item}
              index={gi}
              isSelected={selectedValues.includes(item.value)}
              isMultiple={isMultiple}
              onSelect={handleSelect}
              optionRender={optionRender}
              menuItemSelectedIcon={menuItemSelectedIcon}
            />
          ),
        )}
      </CommandList>
    </Command>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [filteredOptions, selectedValues, isMultiple, showSearch, searchValue, loading,
      listHeight, notFoundContent, handleSearch, handleSelect, handleTagsEnter,
      optionRender, menuItemSelectedIcon, removeLastTag])

  const dropdownContent = dropdownRender ? dropdownRender(cmMenuEl) : cmMenuEl

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    // KEY FIX: Popover.Anchor instead of Popover.Trigger avoids React portal
    // event bubbling from CommandItem clicks reaching a Trigger toggle handler.
    <Popover.Root
      open={open}
      onOpenChange={(next) => !disabled && setOpen(next)}
    >
      <Popover.Anchor asChild>
        <div
          ref={tagsAreaRef}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={virtual ? listboxId : cmListboxId}
          aria-activedescendant={activeDescendant}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-invalid={ariaInvalid || undefined}
          aria-describedby={ariaDescribedby}
          aria-disabled={disabled || undefined}
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
          {/* Multiple mode: visible tags */}
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

          {/* Multiple mode: overflow indicator */}
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

          {/* Single mode: value or placeholder */}
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

          {/* Multiple mode: empty placeholder */}
          {isMultiple && selectedValues.length === 0 && (
            <span
              data-gjs-select-placeholder=""
              className="gjs-select-placeholder pointer-events-none flex-1 text-muted-foreground"
            >
              {placeholder}
            </span>
          )}

          {/* Suffix area */}
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
            if (showSearch || isMultiple) searchInputRef.current?.focus()
          }}
          onPointerDownOutside={(e) => {
            // Prevent DismissableLayer from dismissing when clicking the anchor (trigger).
            // With Popover.Anchor (vs Trigger), Radix doesn't automatically exclude the
            // anchor element from dismiss detection, causing a race condition where the
            // newly-mounted DismissableLayer catches the same pointer event that opened it.
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
          {virtual ? (
            <>
              {(showSearch || isMultiple) && (
                <div
                  data-gjs-select-search-wrapper=""
                  className="gjs-select-search-wrapper flex items-center border-b border-border px-3"
                >
                  <input
                    ref={searchInputRef}
                    data-gjs-select-search=""
                    className="gjs-select-search h-9 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTagsEnter()
                      if (e.key === "Escape") {
                        setOpen(false)
                        triggerRef.current?.focus()
                      }
                      if (e.key === "Backspace" && searchValue === "" && isMultiple) {
                        removeLastTag()
                      }
                    }}
                  />
                </div>
              )}
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
                <VirtualList
                  items={filteredOptions}
                  selectedValues={selectedValues}
                  isMultiple={isMultiple}
                  onSelect={handleSelect}
                  listHeight={listHeight}
                  itemHeight={size === "small" ? 26 : size === "large" ? 40 : 32}
                  optionRender={optionRender}
                  menuItemSelectedIcon={menuItemSelectedIcon}
                  listboxId={listboxId}
                  idPrefix={baseId}
                  onActiveIdChange={setActiveDescendant}
                />
              )}
            </>
          ) : (
            dropdownContent
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
