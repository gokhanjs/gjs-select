import { ImageResponse } from "next/og"

import { Logo } from "@/components/landing/logo"

// Apple touch icon (iOS home screen). iOS applies its own corner mask, so the
// square is full-bleed — mirrors the favicon: dark field, light brand mark.
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <Logo mark="#fafafa" hole="#0a0a0a" width={132} height={132} />
      </div>
    ),
    { ...size },
  )
}
