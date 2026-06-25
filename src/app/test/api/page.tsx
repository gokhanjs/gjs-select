"use client"

import { useEffect, useState } from "react"
import { Select } from "@/components/ui/select"

// Isolated fixtures for Phase 4 API props, driven by query params so the
// functional suite can exercise each prop without touching the main demo page
// (which would shift trigger indices) — mirrors the existing /test fixture.

const OPTIONS = [
  { label: "Banana", value: "banana" },
  { label: "Apple", value: "apple" },
  { label: "Cherry", value: "cherry" },
  { label: "Date", value: "date" },
  { label: "A very long option label", value: "long" },
]

export default function ApiFixturePage() {
  const [ready, setReady] = useState(false)
  const [autofocus, setAutofocus] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only query-param read; avoids SSR hydration mismatch
    setAutofocus(params.get("autofocus") === "1")
    setReady(true)
  }, [])

  if (!ready) return <div data-testid="loading">Loading…</div>

  // autoFocus is isolated on its own case so it cannot steal focus from the
  // other fixtures while they are under test.
  if (autofocus) {
    return (
      <main className="max-w-sm p-8">
        <Select
          options={OPTIONS}
          autoFocus
          aria-label="autoFocus fixture"
          data-testid="autofocus-select"
        />
      </main>
    )
  }

  return (
    <main className="max-w-sm space-y-6 p-8">
      <Select
        options={OPTIONS}
        prefix={<span>$</span>}
        placeholder="prefix"
        aria-label="prefix fixture"
        data-testid="prefix-select"
      />
      <Select
        options={OPTIONS}
        mode="multiple"
        maxTagTextLength={6}
        defaultValue={["long"]}
        aria-label="maxTagTextLength fixture"
        data-testid="maxtag-select"
      />
      <Select
        options={OPTIONS}
        showSearch
        filterSort={(a, b) => String(a.label).localeCompare(String(b.label))}
        placeholder="filterSort"
        aria-label="filterSort fixture"
        data-testid="sort-select"
      />
      <Select
        options={OPTIONS}
        mode="multiple"
        maxCount={2}
        aria-label="maxCount fixture"
        data-testid="maxcount-select"
      />
      <Select
        options={OPTIONS}
        optionLabelProp="value"
        defaultValue="apple"
        aria-label="optionLabelProp fixture"
        data-testid="labelprop-select"
      />
      <Select
        options={OPTIONS}
        direction="rtl"
        placeholder="rtl"
        aria-label="direction fixture"
        data-testid="rtl-select"
      />
      <Select
        options={OPTIONS}
        onMouseEnter={() => setEntered(true)}
        placeholder="events"
        aria-label="event forward fixture"
        data-testid="events-select"
      />
      <div data-testid="entered">{entered ? "yes" : "no"}</div>
      <div id="popup-host" data-testid="popup-host" />
      <Select
        options={OPTIONS}
        getPopupContainer={() => document.getElementById("popup-host") as HTMLElement}
        placeholder="container"
        aria-label="getPopupContainer fixture"
        data-testid="container-select"
      />
    </main>
  )
}
