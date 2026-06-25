"use client"

import * as React from "react"

import { Select, type SelectOption } from "@/components/ui/gjs-select"

// Tiny debounce — no dependency, so the whole pattern is copy-pasteable. The
// callback is read from a ref so it never goes stale without re-creating the
// debounced function.
function useDebouncedCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  delay: number,
) {
  const fnRef = React.useRef(fn)
  React.useEffect(() => {
    fnRef.current = fn
  })
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])
  return React.useCallback(
    (...args: A) => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => fnRef.current(...args), delay)
    },
    [delay],
  )
}

export function AsyncSearch() {
  const [options, setOptions] = React.useState<SelectOption[]>([])
  const [loading, setLoading] = React.useState(false)
  // The chosen option is held separately and merged into the list, so its label
  // still resolves after a later search replaces `options`.
  const [selected, setSelected] = React.useState<SelectOption | null>(null)
  const abortRef = React.useRef<AbortController | null>(null)

  const fetchOptions = React.useCallback(async (query: string) => {
    abortRef.current?.abort()
    if (!query.trim()) {
      setOptions([])
      setLoading(false)
      return
    }
    const ac = new AbortController()
    abortRef.current = ac
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: ac.signal,
      })
      const data: { options: SelectOption[] } = await res.json()
      setOptions(data.options)
    } catch (err) {
      // Ignore aborted requests; surface everything else as "no results".
      if ((err as Error).name !== "AbortError") setOptions([])
    } finally {
      // Only the latest request owns the loading flag (older ones were aborted).
      if (abortRef.current === ac) setLoading(false)
    }
  }, [])

  const onSearch = useDebouncedCallback(fetchOptions, 300)

  const mergedOptions = React.useMemo(() => {
    if (!selected || options.some((o) => o.value === selected.value)) return options
    return [selected, ...options]
  }, [options, selected])

  return (
    <Select
      showSearch
      filterOption={false}
      options={mergedOptions}
      value={selected?.value ?? null}
      onChange={(_v, opt) => setSelected(opt as SelectOption | null)}
      onSearch={onSearch}
      loading={loading}
      allowClear
      placeholder="Search countries…"
      notFoundContent={loading ? "Searching…" : "Type to search"}
      aria-label="Async country search"
    />
  )
}
