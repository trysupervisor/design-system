import type { Metadata } from "next"

import { LedgerThemeDocs } from "@/components/ledger-theme-docs"

export const metadata: Metadata = {
  title: "Ledger theme",
  description: "Install and use the Ledger theme, components, chart, and motion behavior.",
}

export default function LedgerThemePage() {
  return <LedgerThemeDocs />
}
