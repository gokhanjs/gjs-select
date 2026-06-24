import { AntdRegistry } from "@ant-design/nextjs-registry"

// Scoped to the /parity harness only: antd v6 needs its CSS-in-JS injected via
// this registry under the Next App Router, otherwise size/dimension styles do
// not apply. Keeping it here isolates antd from the shipped demo + component.
export default function ParityLayout({ children }: { children: React.ReactNode }) {
  return <AntdRegistry>{children}</AntdRegistry>
}
