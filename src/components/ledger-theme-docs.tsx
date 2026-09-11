"use client"

import * as React from "react"
import Link from "next/link"

import { CodeDisclosure } from "@/components/code-disclosure"
import { CopyCommand } from "@/components/overview"
import {
  LedgerButton,
  LedgerPresence,
  LedgerProvider,
  LedgerRangeSelector,
  LedgerSearch,
  LedgerSurface,
  LedgerTable,
  ledgerMotion,
  ledgerVariables,
} from "@/components/examples/registry/ledger"
import { LedgerChart } from "@/components/examples/registry/ledger-chart"

type LedgerEntry = {
  symbol: string
  name: string
  price: number
  change: number
}

const entries: readonly LedgerEntry[] = [
  { symbol: "NRL", name: "Northline Rail", price: 128.42, change: 1.84 },
  { symbol: "CDR", name: "Cedar Works", price: 76.18, change: 0.62 },
  { symbol: "STW", name: "Stillwater Energy", price: 214.07, change: 2.31 },
  { symbol: "BHR", name: "Blue Harbor", price: 93.54, change: 0.28 },
  { symbol: "FRM", name: "Forma Materials", price: 42.76, change: 1.12 },
]

const chartData = {
  "1D": [
    { label: "09:30", value: 124.8 },
    { label: "10:45", value: 126.1 },
    { label: "12:00", value: 125.5 },
    { label: "13:15", value: 127.2 },
    { label: "14:30", value: 126.8 },
    { label: "16:00", value: 128.42 },
  ],
  "1W": [
    { label: "Mon", value: 121.4 },
    { label: "Tue", value: 123.8 },
    { label: "Wed", value: 122.9 },
    { label: "Thu", value: 126.3 },
    { label: "Fri", value: 128.42 },
  ],
  "1M": [
    { label: "Feb 2", value: 118.2 },
    { label: "Feb 7", value: 119.6 },
    { label: "Feb 12", value: 117.9 },
    { label: "Feb 17", value: 123.1 },
    { label: "Feb 22", value: 125.7 },
    { label: "Feb 27", value: 128.42 },
  ],
} as const

const rangeOptions = ["1D", "1W", "1M"] as const

const ledgerApplicationSource = `"use client"

import { useEffect } from "react"
import { mountLedgerTheme } from "@/components/ui/ledger-runtime"
import "@/components/ui/ledger.css"

export function AppTheme({ children }: { children: React.ReactNode }) {
  useEffect(() => mountLedgerTheme(document.documentElement), [])
  return <>{children}</>
}`

const ledgerChartUsageSource = `import { ComparisonLineChart } from "@/components/ui/chart-cartesian"

const daily = [
  { label: "Monday", current: 42, prior: 37 },
  { label: "Tuesday", current: 47, prior: 41 },
  { label: "Wednesday", current: 54, prior: 46 },
]

export function ActivityChart() {
  return <ComparisonLineChart data={daily} label="Resolved conversations" />
}`

const ledgerTokenGroups = [
  {
    name: "Type",
    values: [
      ["Body", ledgerVariables["--ledger-font-body"]],
      ["Heading", ledgerVariables["--ledger-font-heading"]],
      ["Button", ledgerVariables["--ledger-font-button"]],
      ["Data face", ledgerVariables["--ledger-font-data"]],
    ],
  },
  {
    name: "Corners",
    values: [
      ["Smoothing", ledgerVariables["--ledger-corner-smoothing"]],
      ["Shell", ledgerVariables["--ledger-radius-shell"]],
      ["Panel", ledgerVariables["--ledger-radius-panel"]],
      ["Card", ledgerVariables["--ledger-radius-card"]],
      ["Control", ledgerVariables["--ledger-radius-control"]],
      ["Nested", ledgerVariables["--ledger-radius-nested"]],
    ],
  },
  {
    name: "Space",
    values: [
      ["Inset", ledgerVariables["--ledger-space-inset"]],
      ["Small", ledgerVariables["--ledger-space-small"]],
      ["Control", ledgerVariables["--ledger-space-control"]],
      ["Shell", ledgerVariables["--ledger-space-shell"]],
      ["Panel", ledgerVariables["--ledger-space-panel"]],
    ],
  },
  {
    name: "Table",
    values: [
      ["Row", ledgerVariables["--ledger-table-row-height"]],
      ["Header", ledgerVariables["--ledger-table-header-height"]],
      ["Data", ledgerVariables["--ledger-table-font-size"]],
      ["Label", ledgerVariables["--ledger-table-label-size"]],
      ["Cell inset", ledgerVariables["--ledger-table-cell-padding"]],
      ["Trailing column", ledgerVariables["--ledger-table-trailing-width"]],
    ],
  },
  {
    name: "Motion",
    values: [
      ["Enter", `${ledgerMotion.enter.duration * 1000}ms`],
      ["Exit", `${ledgerMotion.exit.duration * 1000}ms`],
      ["Summary", `${ledgerMotion.summary.duration * 1000}ms`],
      ["Chart", `${ledgerMotion.chart.duration * 1000}ms`],
      ["Layout spring", `${ledgerMotion.layout.stiffness} stiffness, ${ledgerMotion.layout.damping} damping, ${ledgerMotion.layout.mass} mass`],
    ],
  },
  {
    name: "Color",
    values: [
      ["Canvas", ledgerVariables["--ledger-canvas"]],
      ["Paper", ledgerVariables["--ledger-paper"]],
      ["Ink", ledgerVariables["--ledger-ink"]],
      ["Raised ink", ledgerVariables["--ledger-muted"]],
      ["Accent", ledgerVariables["--ledger-accent"]],
      ["Stripe", ledgerVariables["--ledger-stripe"]],
      ["Selection", ledgerVariables["--ledger-selected"]],
    ],
  },
  {
    name: "Chart",
    values: [
      ["Plot height", `${ledgerVariables["--ledger-chart-height"]}px`],
      ["Vertical inset", `${ledgerVariables["--ledger-chart-inset"]}px`],
      ["Morph samples", ledgerVariables["--ledger-chart-samples"]],
      ["Line", ledgerVariables["--ledger-chart-line"]],
      ["Tooltip width", ledgerVariables["--ledger-chart-tooltip-width"]],
    ],
  },
  {
    name: "Shadows",
    values: [
      ["Panel", ledgerVariables["--ledger-shadow-panel"]],
      ["Floating", ledgerVariables["--ledger-shadow-floating"]],
      ["Tooltip", ledgerVariables["--ledger-shadow-tooltip"]],
    ],
  },
] as const

function formatPrice(value: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)
}

export const ledgerMinimalUsageSource = `"use client"

import { useState } from "react"
import {
  LedgerButton,
  LedgerPresence,
  LedgerProvider,
  LedgerRangeSelector,
  LedgerSearch,
  LedgerSurface,
  LedgerTable,
} from "@/components/ui/ledger"
import { LedgerChart } from "@/components/ui/ledger-chart"

const rows = [
  { symbol: "NRL", name: "Northline Rail", price: 128.42 },
  { symbol: "CDR", name: "Cedar Works", price: 76.18 },
]

const series = {
  "1D": [
    { label: "09:30", value: 124.8 },
    { label: "12:00", value: 125.5 },
    { label: "16:00", value: 128.42 },
  ],
  "1W": [
    { label: "Mon", value: 121.4 },
    { label: "Wed", value: 122.9 },
    { label: "Fri", value: 128.42 },
  ],
} as const

export default function LedgerPage() {
  const [selected, setSelected] = useState(rows[0])
  const [range, setRange] = useState<keyof typeof series>("1D")
  const [query, setQuery] = useState("")
  const [showDetail, setShowDetail] = useState(true)
  const visibleRows = rows.filter((row) =>
    (row.symbol + " " + row.name).toLowerCase().includes(query.toLowerCase())
  )
  const selectedSeries = series[range].map((datum) => ({
    ...datum,
    value: datum.value + selected.price - rows[0].price,
  }))

  return (
    <LedgerProvider>
      <LedgerSurface tone="canvas" radius="shell" className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="min-w-0 space-y-3">
          <h1 data-ledger-role="heading">February 2026</h1>
          <LedgerSearch
            value={query}
            onValueChange={setQuery}
            summary={query ? visibleRows.length + " matches" : "Search the ledger"}
          />
          <LedgerSurface className="overflow-hidden" radius="card">
            <LedgerTable>
              <thead><tr><th>Company</th><th>Price</th></tr></thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr
                    key={row.symbol}
                    data-selected={selected.symbol === row.symbol}
                    tabIndex={0}
                    onClick={() => setSelected(row)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        setSelected(row)
                      }
                    }}
                  >
                    <td>{row.symbol} · {row.name}</td>
                    <td>{row.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </LedgerTable>
          </LedgerSurface>
        </section>
        <aside>
          <LedgerPresence show={showDetail}>
            <LedgerSurface tone="ink" radius="panel" elevation="floating" className="space-y-4 p-5">
              <p data-ledger-role="eyebrow">Today</p>
              <h2>{selected.name}</h2>
              <LedgerRangeSelector value={range} options={Object.keys(series)} onValueChange={(value) => setRange(value as keyof typeof series)} />
              <LedgerChart data={selectedSeries} label={selected.name + " illustrative price"} />
              <LedgerButton variant="primary" onClick={() => setShowDetail(false)}>Hide detail</LedgerButton>
            </LedgerSurface>
          </LedgerPresence>
          {!showDetail && <LedgerButton variant="primary" onClick={() => setShowDetail(true)}>Show detail</LedgerButton>}
        </aside>
      </LedgerSurface>
    </LedgerProvider>
  )
}`

function LedgerDemo({ compact = false, style = ledgerVariables as React.CSSProperties }: { compact?: boolean; style?: React.CSSProperties }) {
  const [selectedSymbol, setSelectedSymbol] = React.useState(entries[0].symbol)
  const [range, setRange] = React.useState<(typeof rangeOptions)[number]>("1M")
  const [query, setQuery] = React.useState("")
  const [showDetail, setShowDetail] = React.useState(true)
  const selected = entries.find((entry) => entry.symbol === selectedSymbol) ?? entries[0]
  const normalizedQuery = query.trim().toLowerCase()
  const visibleEntries = entries.filter((entry) =>
    `${entry.symbol} ${entry.name}`.toLowerCase().includes(normalizedQuery)
  )
  const selectedChartData = React.useMemo(
    () => chartData[range].map((datum) => ({
      ...datum,
      value: datum.value + selected.price - entries[0].price,
    })),
    [range, selected.price]
  )

  return (
    <LedgerProvider className="w-full" style={style}>
      <LedgerSurface
        tone="canvas"
        radius="shell"
        className={compact
          ? "grid min-h-72 gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_12rem]"
          : "grid min-h-[34rem] gap-4 p-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.8fr)] lg:p-5"}
      >
        <section className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p data-ledger-role="eyebrow" className="mb-1">Monthly ledger</p>
              <h2 data-ledger-role="heading">February 2026</h2>
            </div>
            {!compact && <span data-ledger-role="meta">Illustrative data</span>}
          </div>
          <div className="mb-3">
            <LedgerSearch
              value={query}
              onValueChange={setQuery}
              placeholder="Search entries"
              summary={query ? `${visibleEntries.length} ${visibleEntries.length === 1 ? "match" : "matches"}` : `${entries.length} entries`}
            />
          </div>
          <LedgerSurface radius="card" className="overflow-hidden">
            <LedgerTable aria-label="Illustrative February ledger entries">
              <thead>
                <tr>
                  <th>Company</th>
                  {!compact && <th>Change</th>}
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {visibleEntries.map((entry) => (
                  <tr
                    key={entry.symbol}
                    data-selected={selected.symbol === entry.symbol ? "true" : undefined}
                    tabIndex={0}
                    onClick={() => setSelectedSymbol(entry.symbol)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        setSelectedSymbol(entry.symbol)
                      }
                    }}
                    aria-label={`Show ${entry.name}`}
                  >
                    <td><strong>{entry.symbol}</strong><span className="ml-2">{entry.name}</span></td>
                    {!compact && <td>{entry.change.toFixed(2)}%</td>}
                    <td>{entry.price.toFixed(2)}</td>
                  </tr>
                ))}
                {visibleEntries.length === 0 && (
                  <tr><td colSpan={compact ? 2 : 3}>No entries match this search.</td></tr>
                )}
              </tbody>
            </LedgerTable>
          </LedgerSurface>
        </section>

        <aside className="min-w-0">
          <LedgerPresence show={showDetail}>
            <LedgerSurface tone="ink" radius="panel" elevation="floating" className={compact ? "space-y-3 p-4" : "space-y-5 p-5"}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p data-ledger-role="eyebrow">Today</p>
                  <h3 className="mt-1">{selected.name}</h3>
                </div>
                <span aria-hidden="true" className="mt-1 size-2 rounded-full bg-[var(--ledger-accent)]" />
              </div>
              <div>
                <p data-ledger-role="display">{formatPrice(selected.price)}</p>
                <p data-ledger-role="delta" className="mt-1">{selected.change.toFixed(2)}% in this example</p>
              </div>
              <LedgerRangeSelector value={range} options={rangeOptions} onValueChange={(value) => setRange(value as (typeof rangeOptions)[number])} />
              <LedgerChart data={selectedChartData} label={`${selected.name} illustrative price`} formatValue={formatPrice} />
              {!compact && <LedgerButton variant="ghost" onClick={() => setShowDetail(false)}>Hide detail</LedgerButton>}
            </LedgerSurface>
          </LedgerPresence>
          {!showDetail && (
            <LedgerSurface tone="muted" radius="card" className="flex min-h-32 items-center justify-center p-4">
              <LedgerButton variant="primary" onClick={() => setShowDetail(true)}>Show detail</LedgerButton>
            </LedgerSurface>
          )}
        </aside>
      </LedgerSurface>
    </LedgerProvider>
  )
}

export function LedgerStudioPreview({ style }: { style?: React.CSSProperties }) {
  return <LedgerDemo compact style={style} />
}

export function LedgerThemeDocs() {
  return (
    <article className="mx-auto w-full max-w-5xl">
      <header className="mb-10 border-b pb-8">
        <p className="eyebrow mb-4">THEME GUIDE</p>
        <h1 className="page-title">Ledger</h1>
        <p className="page-description">A compact interface kit for tables, selection, search, charts, and detail panels. Its pale canvas, white paper, dark ink, and single red marker keep dense data readable.</p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs">
          <Link className="underline underline-offset-4" href="/themes">Open in Theme Studio</Link>
          <a className="underline underline-offset-4" href="https://github.com/trysupervisor/design-system/tree/main/src/components/examples/registry">View source</a>
        </div>
      </header>

      <section aria-labelledby="ledger-preview" className="mb-12">
        <div className="mb-5 max-w-2xl">
          <h2 id="ledger-preview" className="text-lg font-semibold tracking-tight">Working example</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Search the ledger, choose a row, change the chart range, and hide the detail panel. Hover or focus the chart to inspect a point.</p>
        </div>
        <LedgerDemo />
      </section>

      <section aria-labelledby="ledger-install" className="mb-12 border-t pt-9">
        <h2 id="ledger-install" className="text-lg font-semibold tracking-tight">Install the full kit</h2>
        <p className="mt-2 mb-5 max-w-2xl text-sm leading-6 text-muted-foreground">Run one command in a Next.js app with shadcn configured. The registry item installs the Ledger theme, provider, components, chart, tokens, and styles together.</p>
        <CopyCommand command="bunx shadcn@latest add https://ui.trysupervisor.com/r/theme-ledger.json" />
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">The installer follows the aliases in components.json. The example below uses the standard <code>@/components/ui</code> path. Change those imports if your app uses another UI alias.</p>
        <div className="panel mt-5 overflow-hidden">
          <CodeDisclosure title="Ledger page" code={ledgerMinimalUsageSource} />
        </div>
      </section>

      <section aria-labelledby="ledger-catalog" className="mb-12 border-t pt-9">
        <h2 id="ledger-catalog" className="text-lg font-semibold tracking-tight">Use Ledger across your app</h2>
        <p className="mt-2 mb-5 max-w-2xl text-sm leading-6 text-muted-foreground">Your existing shadcn components and AI Elements share Ledger typography, control spacing, continuous corners, focus states, shadows, and enter and exit timing. Wrap your layout in this client component after installing the theme. Keep your existing dark mode switch.</p>
        <div className="panel overflow-hidden"><CodeDisclosure title="Application theme" code={ledgerApplicationSource} /></div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">For a light Ledger section inside another theme, use LedgerProvider. Dialogs and menus opened from that section inherit its tokens. Mount a toaster inside the same provider, or use the application wrapper for global toasts.</p>
        <h3 className="mt-7 text-base font-medium">Add the chart collection</h3>
        <p className="mt-2 mb-5 max-w-2xl text-sm leading-6 text-muted-foreground">Install the <Link className="underline underline-offset-4" href="/charts">chart collection</Link> for comparisons, distributions, ranges, targets, heatmaps, and more. The examples use the same portable components that this command installs.</p>
        <CopyCommand command="bunx shadcn@latest add https://ui.trysupervisor.com/r/supervisor-charts.json" />
        <div className="panel mt-5 overflow-hidden"><CodeDisclosure title="Chart with application data" code={ledgerChartUsageSource} /></div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">Pass data for a single series window, or data and expandedData to enable both range controls. Omitted data shows illustrative examples. Chart colors, labels, values, tooltips, and legends follow the active theme.</p>
      </section>

      <section aria-labelledby="ledger-tokens" className="mb-12 border-t pt-9">
        <div className="mb-5 max-w-2xl">
          <h2 id="ledger-tokens" className="text-lg font-semibold tracking-tight">Token reference</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">These values come from the runtime exports used by the components. Changing a token updates every component that owns that role.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ledgerTokenGroups.map((group) => (
            <section key={group.name} className="panel min-w-0 p-4">
              <h3 className="text-sm font-semibold">{group.name}</h3>
              <dl className="mt-3 divide-y text-xs">
                {group.values.map(([label, value]) => (
                  <div key={label} className="grid gap-1 py-2">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd><code className="break-words font-mono text-[11px]">{value}</code></dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </section>

      <div className="grid gap-8 border-t pt-9 md:grid-cols-2">
        <section aria-labelledby="ledger-rules">
          <h2 id="ledger-rules" className="text-lg font-semibold tracking-tight">Visual rules</h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
            <p>Four colors carry the interface. Pale gray is the canvas, white is paper, charcoal is ink, and red marks the current chart endpoint or another item that needs attention.</p>
            <p>Spacing follows roles. Shell, panel, control, and inset values come from the installed tokens. The radii use continuous corners with smoothing set to 0.6. Shadows sit outside the fill mask, so they do not clip at a rounded edge.</p>
            <p>Text uses the native San Francisco family on Apple devices. System fallbacks cover other platforms. Tabular data uses the installed monospace stack. Theme Studio can adjust the body, heading, and button typefaces separately.</p>
          </div>
        </section>

        <section aria-labelledby="ledger-behavior">
          <h2 id="ledger-behavior" className="text-lg font-semibold tracking-tight">Behavior</h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
            <p>The chart morphs when its range changes. Pointer, touch, Left Arrow, Right Arrow, Home, End, and Escape controls inspect points. Reduced motion removes spatial movement and shortens transitions.</p>
            <p>Closing search clears its value and returns focus to the trigger. Escape works from the field and its close control. The exit animation keeps the field mounted, inert, and padded until the transition finishes.</p>
            <p>Detail panels use the same enter and exit timing as search. Content becomes inert while it leaves, which prevents focus from landing in a hidden panel.</p>
          </div>
        </section>
      </div>

      <section aria-labelledby="ledger-exports" className="mt-10 border-t pt-9">
        <h2 id="ledger-exports" className="text-lg font-semibold tracking-tight">Exports and limits</h2>
        <div className="mt-4 max-w-3xl space-y-4 text-sm leading-6 text-muted-foreground">
          <p>Copy CSS and Export JSON in Theme Studio save the editable palette, type choice, spacing, radius, border, and shadow values. Those exports do not include the Ledger components or chart behavior. Use the registry command above when the app needs the full kit.</p>
          <p>LedgerProvider creates a light section. The application wrapper applies the selected Ledger palette across both color modes. Nested theme boundaries keep other themes independent.</p>
          <p>The included data is deterministic and illustrative. Connect your own data source, formatting, loading state, and error state in the consuming app.</p>
        </div>
      </section>
    </article>
  )
}
