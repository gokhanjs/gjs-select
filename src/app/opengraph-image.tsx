import { ImageResponse } from "next/og"

import { Logo } from "@/components/landing/logo"
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
          <Logo mark="#fafafa" hole="#0a0a0a" width={76} height={76} />
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
