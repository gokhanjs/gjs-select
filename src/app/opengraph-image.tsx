import { ImageResponse } from "next/og"

import { site } from "@/lib/site"

export const alt = `${site.name} — ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#fafafa",
            }}
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <div style={{ fontSize: 36, fontWeight: 600, color: "#a1a1aa" }}>
            {site.name}
          </div>
        </div>

        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            marginTop: 40,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          {`${site.tagline}.`}
        </div>

        <div style={{ fontSize: 30, color: "#a1a1aa", marginTop: 28, maxWidth: 920 }}>
          {"Single, multiple and tags · search · virtualized · accessible. Copy-paste via the shadcn CLI."}
        </div>
      </div>
    ),
    { ...size },
  )
}
