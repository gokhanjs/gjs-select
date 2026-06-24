"use client"

// Parity harness — renders antd Select and the custom (gjs) Select side by side
// with identical props. The Playwright parity spec measures antd as the oracle
// and compares the custom implementation against it. This page is a test
// fixture, not a public demo.

import { Select as AntdSelect } from "antd"
import { Select as GjsSelect } from "@/components/ui/select"

const FRUITS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Durian", value: "durian", disabled: true },
  { label: "Elderberry", value: "elderberry" },
]

const GROUPED = [
  {
    label: "Fruits",
    options: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
    ],
  },
  {
    label: "Vegetables",
    options: [
      { label: "Carrot", value: "carrot" },
      { label: "Daikon", value: "daikon" },
    ],
  },
]

function Row({
  id,
  label,
  antd,
  gjs,
}: {
  id: string
  label: string
  antd: React.ReactNode
  gjs: React.ReactNode
}) {
  return (
    <div data-case={id} className="grid grid-cols-[140px_1fr_1fr] items-center gap-6 border-b border-gray-200 py-4">
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div data-impl="antd" style={{ width: 256 }}>
        {antd}
      </div>
      <div data-impl="gjs" style={{ width: 256 }}>
        {gjs}
      </div>
    </div>
  )
}

export default function ParityPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <header className="mb-6 grid grid-cols-[140px_1fr_1fr] gap-6">
        <div className="text-sm font-semibold">case</div>
        <div className="text-sm font-semibold text-blue-600">antd (oracle)</div>
        <div className="text-sm font-semibold text-emerald-600">gjs (custom)</div>
      </header>

      {/* ── Sizes ── */}
      <Row
        id="size-small"
        label="size=small"
        antd={<AntdSelect size="small" options={FRUITS} placeholder="Pick" style={{ width: "100%" }} popupClassName="antd-pop-size-small" />}
        gjs={<GjsSelect size="small" options={FRUITS} placeholder="Pick" aria-label="gjs small" dropdownClassName="gjs-pop-size-small" />}
      />
      <Row
        id="size-middle"
        label="size=middle"
        antd={<AntdSelect options={FRUITS} placeholder="Pick" style={{ width: "100%" }} popupClassName="antd-pop-size-middle" />}
        gjs={<GjsSelect options={FRUITS} placeholder="Pick" aria-label="gjs middle" dropdownClassName="gjs-pop-size-middle" />}
      />
      <Row
        id="size-large"
        label="size=large"
        antd={<AntdSelect size="large" options={FRUITS} placeholder="Pick" style={{ width: "100%" }} popupClassName="antd-pop-size-large" />}
        gjs={<GjsSelect size="large" options={FRUITS} placeholder="Pick" aria-label="gjs large" dropdownClassName="gjs-pop-size-large" />}
      />

      {/* ── Single, basic (option metrics + defaultActiveFirstOption) ── */}
      <Row
        id="single"
        label="single basic"
        antd={<AntdSelect options={FRUITS} placeholder="Pick" style={{ width: "100%" }} popupClassName="antd-pop-single" />}
        gjs={<GjsSelect options={FRUITS} placeholder="Pick" aria-label="gjs single" dropdownClassName="gjs-pop-single" />}
      />

      {/* ── Single + showSearch (inline-search-in-selector divergence) ── */}
      <Row
        id="single-search"
        label="single showSearch"
        antd={<AntdSelect showSearch options={FRUITS} placeholder="Search" style={{ width: "100%" }} popupClassName="antd-pop-single-search" />}
        gjs={<GjsSelect showSearch options={FRUITS} placeholder="Search" aria-label="gjs search" dropdownClassName="gjs-pop-single-search" />}
      />

      {/* ── Multiple (check-icon vs checkbox + tag height) ── */}
      <Row
        id="multiple"
        label="multiple"
        antd={<AntdSelect mode="multiple" options={FRUITS} defaultValue={["apple", "banana"]} style={{ width: "100%" }} popupClassName="antd-pop-multiple" />}
        gjs={<GjsSelect mode="multiple" options={FRUITS} defaultValue={["apple", "banana"]} aria-label="gjs multiple" dropdownClassName="gjs-pop-multiple" />}
      />

      {/* ── Tags (tokenSeparators divergence) ── */}
      <Row
        id="tags"
        label="tags + separators"
        antd={<AntdSelect mode="tags" tokenSeparators={[","]} options={FRUITS} placeholder="Type" style={{ width: "100%" }} popupClassName="antd-pop-tags" />}
        gjs={<GjsSelect mode="tags" options={FRUITS} placeholder="Type" aria-label="gjs tags" dropdownClassName="gjs-pop-tags" />}
      />

      {/* ── Grouped ── */}
      <Row
        id="grouped"
        label="grouped"
        antd={<AntdSelect options={GROUPED} placeholder="Pick" style={{ width: "100%" }} popupClassName="antd-pop-grouped" />}
        gjs={<GjsSelect options={GROUPED} placeholder="Pick" aria-label="gjs grouped" dropdownClassName="gjs-pop-grouped" />}
      />

      {/* ── allowClear ── */}
      <Row
        id="clear"
        label="allowClear"
        antd={<AntdSelect allowClear options={FRUITS} defaultValue="apple" style={{ width: "100%" }} popupClassName="antd-pop-clear" />}
        gjs={<GjsSelect allowClear options={FRUITS} defaultValue="apple" aria-label="gjs clear" dropdownClassName="gjs-pop-clear" />}
      />

      {/* ── status=error ── */}
      <Row
        id="status"
        label="status=error"
        antd={<AntdSelect status="error" options={FRUITS} placeholder="Pick" style={{ width: "100%" }} popupClassName="antd-pop-status" />}
        gjs={<GjsSelect status="error" options={FRUITS} placeholder="Pick" aria-label="gjs status" dropdownClassName="gjs-pop-status" />}
      />
    </main>
  )
}
