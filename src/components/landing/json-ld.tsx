import { site } from "@/lib/site"

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        alternateName: [
          "shadcn Select",
          "shadcn Multi-Select",
          "Ant Design Select for shadcn/ui",
        ],
        url: site.url,
        description: site.description,
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${site.url}/#software`,
        name: site.name,
        description: site.description,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        url: site.url,
        keywords: site.keywords.join(", "),
        featureList: [
          "Single, multiple, and tags selection modes",
          "Built-in search and filtering",
          "Virtualized option lists",
          "Responsive tag overflow (maxTagCount)",
          "Keyboard and screen-reader accessible",
          "Ant Design Select API parity",
        ],
        author: { "@type": "Person", name: site.author, url: site.github },
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        license: "https://opensource.org/licenses/MIT",
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
