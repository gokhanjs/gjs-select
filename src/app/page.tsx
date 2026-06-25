import { Hero } from "@/components/landing/hero"
import { Installation } from "@/components/landing/installation"
import { JsonLd } from "@/components/landing/json-ld"
import { PatternsShowcase } from "@/components/landing/patterns-showcase"
import { PropsTable } from "@/components/landing/props-table"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { UsagePlayground } from "@/components/landing/usage-playground"
import { VariantsShowcase } from "@/components/landing/variants-showcase"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd />
      <SiteHeader />
      <main>
        <Hero />
        <Installation />
        <VariantsShowcase />
        <PatternsShowcase />
        <UsagePlayground />
        <PropsTable />
      </main>
      <SiteFooter />
    </div>
  )
}
