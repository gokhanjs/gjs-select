import { Hero } from "@/components/landing/hero"
import { Installation } from "@/components/landing/installation"
import { PropsTable } from "@/components/landing/props-table"
import { SiteFooter } from "@/components/landing/site-footer"
import { SiteHeader } from "@/components/landing/site-header"
import { UsagePlayground } from "@/components/landing/usage-playground"
import { VariantsShowcase } from "@/components/landing/variants-showcase"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Installation />
        <VariantsShowcase />
        <UsagePlayground />
        <PropsTable />
      </main>
      <SiteFooter />
    </div>
  )
}
