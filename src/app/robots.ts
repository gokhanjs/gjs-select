import type { MetadataRoute } from "next"

import { site } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    // Index the landing only; the demo and test fixtures stay out of search.
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/demo", "/test", "/test/api"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
