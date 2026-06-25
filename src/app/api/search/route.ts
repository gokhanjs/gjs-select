import { NextResponse } from "next/server"

import { COUNTRIES } from "./countries"

// Reading the query string opts this handler into dynamic (per-request)
// rendering; force-dynamic makes that explicit so results are never cached.
export const dynamic = "force-dynamic"

/**
 * Demo search endpoint: case-insensitive country-name match with a small
 * simulated latency, so the debounced + loading UI on the client is observable.
 * Results are capped to keep the payload light.
 */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim().toLowerCase() ?? ""

  // Simulate network/database round-trip latency.
  await new Promise((resolve) => setTimeout(resolve, 350))

  const options = q
    ? COUNTRIES.filter((c) => c.label.toLowerCase().includes(q)).slice(0, 20)
    : []

  return NextResponse.json({ options })
}
