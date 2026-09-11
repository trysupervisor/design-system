"use client"

import * as React from "react"
import Link from "next/link"
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Monitor,
  Moon,
  Save,
  Search,
  Sparkles,
  Sun,
  Trash2,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LedgerStudioPreview } from "@/components/ledger-theme-docs"
import { useTheme } from "@/components/theme-provider"
import {
  FONT_OPTIONS,
  getThemeFontSetup,
  importThemeJson,
  mergeTheme,
  parseTheme,
  themeCategoryIds,
  themeToCss,
  themeToJson,
  themeVariables,
  type ThemeDefinition,
  type ThemeFontId,
  type ThemeMode,
  type ThemePalette,
} from "@/lib/theme"
import { themePresets } from "@/lib/theme-presets"
import { brandThemeReferences } from "@/lib/brand-theme-references"
import { themeToRegistry } from "@/lib/theme-registry"

type PreviewMode = "light" | "dark"

const categoryLabels: Record<ThemeDefinition["category"], string> = {
  neutral: "Neutral",
  brand: "Brand inspired",
  editorial: "Editorial",
  colorful: "Colorful",
  soft: "Soft",
  technical: "Technical",
}

const editableColors: { key: keyof ThemePalette; label: string; pair?: keyof ThemePalette }[] = [
  { key: "background", label: "Canvas", pair: "foreground" },
  { key: "card", label: "Card", pair: "cardForeground" },
  { key: "primary", label: "Primary", pair: "primaryForeground" },
  { key: "secondary", label: "Secondary", pair: "secondaryForeground" },
  { key: "accent", label: "Accent", pair: "accentForeground" },
  { key: "muted", label: "Muted", pair: "mutedForeground" },
  { key: "border", label: "Border" },
  { key: "ring", label: "Focus" },
]

function luminance(color: string) {
  const values = [1, 3, 5].map((index) => {
    const value = Number.parseInt(color.slice(index, index + 2), 16) / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2]
}

function readableText(color: string) {
  const value = luminance(color)
  const blackContrast = (value + 0.05) / 0.05
  const whiteContrast = 1.05 / (value + 0.05)
  return blackContrast >= whiteContrast ? "#000000" : "#FFFFFF"
}

function customId(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32) || "theme"
  return `custom-${slug}-${Date.now().toString(36)}`
}

function downloadFile(name: string, contents: string, type: string) {
  const blob = new Blob([contents], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  window.setTimeout(() => {
    link.remove()
    URL.revokeObjectURL(url)
  }, 1000)
}

function PresetCard({
  preset,
  selected,
  onSelect,
}: {
  preset: ThemeDefinition
  selected: boolean
  onSelect: () => void
}) {
  const reference = brandThemeReferences[preset.id]
  const palette = preset[reference?.mode ?? "light"]
  const font = getThemeFontSetup(preset)
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Preview ${preset.name}`}
      aria-pressed={selected}
      className="group w-full rounded-xl border bg-card p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-foreground/40 aria-pressed:ring-2 aria-pressed:ring-ring/30"
    >
      <span aria-hidden="true" className="mb-3 flex h-24 overflow-hidden border" style={{ background: palette.background, borderColor: palette.border, borderWidth: preset.borderWidth, borderRadius: `${preset.radius}rem`, fontFamily: font.cssFamily }}>
        <span className="w-[27%] border-r p-2" style={{ background: palette.sidebar, borderColor: palette.sidebarBorder }}>
          <span className="block h-1.5 w-full rounded-sm" style={{ background: palette.sidebarPrimary }} />
          <span className="mt-2 block h-1 w-full rounded-sm opacity-40" style={{ background: palette.sidebarForeground }} />
          <span className="mt-1.5 block h-1 w-3/4 rounded-sm opacity-30" style={{ background: palette.sidebarForeground }} />
        </span>
        <span className="min-w-0 flex-1" style={{ padding: `${preset.spacing * 8}px` }}>
          <span className="block text-[11px] font-semibold" style={{ color: palette.foreground }}>Overview</span>
          <span className="mt-1 block border px-1.5 py-1 text-[12px]" style={{ color: palette.foreground, background: palette.card, borderColor: palette.border, borderWidth: preset.borderWidth, borderRadius: `${preset.radius * 0.5}rem` }}>Aa 123</span>
          <span className="mt-1.5 block w-12 text-center text-[8px] leading-none" style={{ background: palette.primary, color: palette.primaryForeground, paddingBlock: `${preset.controlHeight * 1.5}px`, borderRadius: `${preset.buttonRadius ?? preset.radius}rem`, fontWeight: preset.buttonWeight ?? 500 }}>Continue</span>
        </span>
      </span>
      <span className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium">{preset.name}</span>
        <span className="size-2.5 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: palette.primary }} />
      </span>
      <span className="mt-1 block truncate text-[10px] text-muted-foreground">{font.label}{reference ? ` · ${reference.mode === "dark" ? "Dark" : "Light"} reference` : ` · ${categoryLabels[preset.category]}`}</span>
    </button>
  )
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix?: string
  onChange: (value: number) => void
}) {
  return (
    <label className="grid gap-2 text-xs">
      <span className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">{value}{suffix}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      />
    </label>
  )
}

function ModeButtons({ value, onChange, includeSystem = false }: { value: ThemeMode | PreviewMode; onChange: (mode: ThemeMode) => void; includeSystem?: boolean }) {
  const options: { value: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    ...(includeSystem ? [{ value: "system" as const, label: "System", icon: Monitor }] : []),
  ]
  return (
    <div className="inline-flex rounded-lg border bg-muted/40 p-0.5" role="group" aria-label="Color mode">
      {options.map((option) => {
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className="flex h-7 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition hover:text-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm"
          >
            <Icon className="size-3.5" />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function ThemePreview({ theme, mode }: { theme: ThemeDefinition; mode: PreviewMode }) {
  const variables = {
    ...themeVariables(theme, mode),
    fontFamily: "var(--app-font)",
    fontSize: "calc(1rem * var(--text-scale))",
  } as React.CSSProperties
  return (
    <div data-theme-preview={theme.id} className={`${mode === "dark" ? "dark" : ""} [&_.preview-border]:border-[length:var(--border-width)]`} style={variables}>
      <div className="preview-border overflow-hidden rounded-[calc(var(--radius)*1.8)] border bg-background text-foreground shadow-[var(--theme-shadow)]">
        <div className="preview-border flex h-10 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-primary" />
            <span className="text-[0.75em] font-semibold tracking-tight">Northstar</span>
          </div>
          <div className="size-6 rounded-full bg-muted" />
        </div>
        <div className="grid min-h-80 grid-cols-[108px_1fr] sm:grid-cols-[148px_1fr]">
          <aside className="preview-border border-r bg-sidebar p-3 text-sidebar-foreground">
            <p className="mb-3 text-[0.5625em] font-medium uppercase tracking-widest opacity-45">Workspace</p>
            {["Overview", "Activity", "Projects", "Reports"].map((item, index) => (
              <div key={item} className={`mb-1 rounded-md px-2 py-1.5 text-[0.625em] ${index === 0 ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground" : "opacity-60"}`}>
                {item}
              </div>
            ))}
          </aside>
          <main className="min-w-0 p-4 sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.875em] font-semibold">Good morning, Alex</p>
                <p className="mt-1 text-[0.625em] text-muted-foreground">Your team completed 84 tasks this month.</p>
              </div>
              <button className="h-[var(--control-height)] shrink-0 rounded-[var(--button-radius)] bg-primary px-3 text-[0.625em] font-[number:var(--button-weight)] text-primary-foreground">New report</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Active projects", "Tasks closed", "On time"].map((label, index) => (
                <div key={label} className="preview-border rounded-[var(--radius)] border bg-card p-3 text-card-foreground">
                  <p className="text-[0.5625em] text-muted-foreground">{label}</p>
                  <p className="mt-1.5 text-[1.125em] font-semibold tabular-nums">{[12, 248, "94%"][index]}</p>
                </div>
              ))}
            </div>
            <div className="preview-border mt-3 rounded-[var(--radius)] border bg-card p-3 text-card-foreground">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[0.625em] font-medium">Weekly activity</p>
                <span className="rounded-full bg-secondary px-2 py-1 text-[0.5625em] text-secondary-foreground">Last 7 days</span>
              </div>
              <div className="flex h-20 items-end gap-2">
                {[42, 64, 48, 76, 58, 88, 70].map((height, index) => (
                  <span key={index} className="flex-1 rounded-t-sm" style={{ height: `${height}%`, background: `var(--chart-${(index % 5) + 1})` }} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export function ThemeStudio() {
  const { theme: appliedTheme, mode, resolvedMode, ready, setMode, applyTheme, savedThemes, saveTheme, renameTheme, deleteTheme } = useTheme()
  const [draft, setDraft] = React.useState(appliedTheme)
  const [previewMode, setPreviewMode] = React.useState<PreviewMode>(resolvedMode)
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState<"all" | ThemeDefinition["category"]>("all")
  const [prompt, setPrompt] = React.useState("")
  const [generating, setGenerating] = React.useState(false)
  const [error, setError] = React.useState("")
  const [copied, setCopied] = React.useState(false)
  const importRef = React.useRef<HTMLInputElement>(null)
  const syncedDraft = React.useRef(false)

  React.useEffect(() => {
    if (!ready || syncedDraft.current) return
    syncedDraft.current = true
    queueMicrotask(() => {
      setDraft(appliedTheme)
      setPreviewMode(resolvedMode)
    })
  }, [appliedTheme, ready, resolvedMode])

  const presets = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return themePresets.filter((preset) => {
      const categoryMatch = category === "all" || preset.category === category
      const searchMatch = !query || `${preset.name} ${preset.id} ${categoryLabels[preset.category]}`.toLowerCase().includes(query)
      return categoryMatch && searchMatch
    })
  }, [category, search])
  const fontSetup = getThemeFontSetup(draft)
  const brandReference = brandThemeReferences[draft.id]
  const isLedgerRecipe = draft.recipe === "ledger"
  const referencePreset = themePresets.find((preset) => preset.id === draft.id)
  const referenceModified = referencePreset && JSON.stringify(parseTheme(draft)) !== JSON.stringify(parseTheme(referencePreset))
  const ledgerDraftModified = isLedgerRecipe && (draft.id !== "ledger" || Boolean(referenceModified))

  const patchDraft = (patch: Parameters<typeof mergeTheme>[1]) => {
    try {
      const next = mergeTheme(draft, patch)
      setDraft(next)
      setError("")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "That value cannot be used")
    }
  }

  const changeColor = (key: keyof ThemePalette, value: string, pair?: keyof ThemePalette) => {
    const palette = draft[previewMode]
    const nextPalette: Partial<ThemePalette> = { [key]: value }
    if (pair) nextPalette[pair] = readableText(value)
    patchDraft({ [previewMode]: { ...palette, ...nextPalette } })
  }

  const generateTheme = async () => {
    if (!prompt.trim()) return
    setGenerating(true)
    setError("")
    try {
      const response = await fetch("/api/themes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), currentTheme: draft }),
      })
      const payload: unknown = await response.json().catch(() => null)
      if (!response.ok) {
        const message = payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "Theme generation failed"
        throw new Error(message)
      }
      if (!payload || typeof payload !== "object" || !("theme" in payload) || !("source" in payload) || payload.source !== "model") {
        throw new Error("The model returned an invalid response")
      }
      setDraft(parseTheme(payload.theme))
      setPrompt("")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Theme generation failed")
    } finally {
      setGenerating(false)
    }
  }

  const saveCurrent = () => {
    try {
      const isCustom = savedThemes.some((saved) => saved.id === draft.id)
      const copyName = `${draft.name.slice(0, 43).trimEnd()} Copy`
      const next = isCustom ? draft : parseTheme({ ...draft, id: customId(draft.name), name: copyName })
      saveTheme(next)
      setDraft(next)
      setError("")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Theme save failed")
    }
  }

  const importJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    try {
      const imported = importThemeJson(await file.text())
      setDraft(imported)
      setError("")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Theme import failed")
    }
  }

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(themeToCss(draft))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setError("Clipboard access failed")
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Theme Studio</p>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Shape every detail.</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Start with a preset, tune its system, or describe your own direction.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ModeButtons value={mode} onChange={setMode} includeSystem />
          <Button variant="outline" onClick={() => importRef.current?.click()}><Upload /> Import JSON</Button>
          <input ref={importRef} type="file" accept="application/json,.json" onChange={importJson} className="sr-only" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(330px,0.65fr)]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4" /> Describe a theme</div>
            <p className="mb-4 text-xs leading-5 text-muted-foreground">Write what you want to see. Your current theme gives the generator a starting point.</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <Textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Netflix like, with light green instead of red" className="min-h-20 flex-1 resize-none bg-background" />
              <Button className="sm:mb-0 sm:w-36" onClick={generateTheme} disabled={generating || !prompt.trim()}>
                {generating ? "Generating…" : "Generate theme"}
              </Button>
            </div>
            {error && <div role="alert" className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{error}</div>}
          </section>

          <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">Live preview</h2>
                <p className="mt-1 text-xs text-muted-foreground">Changes stay here until you apply them.</p>
              </div>
              <ModeButtons value={previewMode} onChange={(next) => next !== "system" && setPreviewMode(next)} />
            </div>
            <ThemePreview theme={draft} mode={previewMode} />
            {isLedgerRecipe && (
              <div className="mt-5 border-t pt-5">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">Ledger runtime preview</h3>
                    <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">This isolated preview uses the installed Ledger components and keeps the site theme unchanged.</p>
                  </div>
                  <Button variant="outline" size="sm" asChild><Link href="/themes/ledger">Open guide <ExternalLink /></Link></Button>
                </div>
                <LedgerStudioPreview style={themeVariables(draft, previewMode) as React.CSSProperties} />
              </div>
            )}
            {brandReference && (
              <div className="mt-4 border-t pt-4 text-xs leading-5" data-brand-reference={draft.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{referenceModified ? `Starting reference: ${brandReference.reference}` : brandReference.reference}</h3>
                  <span className="text-[10px] text-muted-foreground">Researched September 10, 2026</span>
                </div>
                {referenceModified && <p className="mt-2">These references describe the preset before your edits.</p>}
                <p className="mt-2 text-muted-foreground">{brandReference.typography}</p>
                <p className="mt-2 text-muted-foreground">{brandReference.geometry}</p>
                <p className="mt-2 text-muted-foreground">{brandReference.adaptation}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {brandReference.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-muted-foreground">{source.label}<ExternalLink className="size-3" /></a>)}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold">Presets</h2>
                <p className="mt-1 text-xs text-muted-foreground">{themePresets.length} themes. Brand presets include researched references and free font alternatives.</p>
              </div>
              <div className="flex gap-2">
                <label className="relative min-w-0 flex-1 sm:w-52">
                  <Search className="pointer-events-none absolute left-2.5 top-2 size-4 text-muted-foreground" />
                  <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search themes" className="pl-8" />
                </label>
                <select value={category} onChange={(event) => setCategory(event.target.value as typeof category)} aria-label="Theme category" className="h-8 rounded-lg border border-input bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring">
                  <option value="all">All styles</option>
                  {themeCategoryIds.map((id) => <option key={id} value={id}>{categoryLabels[id]}</option>)}
                </select>
              </div>
            </div>
            <div className="max-h-[480px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {presets.map((preset) => (
                  <div key={preset.id} className="min-w-0">
                    <PresetCard preset={preset} selected={draft.id === preset.id} onSelect={() => { setDraft(preset); setPreviewMode(brandThemeReferences[preset.id]?.mode ?? previewMode); setError("") }} />
                    {(preset.id === "ledger" || preset.recipe === "ledger") && <Link href="/themes/ledger" className="mt-2 flex items-center justify-between px-1 text-[10px] text-muted-foreground hover:text-foreground">Ledger guide <ExternalLink className="size-3" /></Link>}
                  </div>
                ))}
              </div>
              {presets.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No themes match that search.</div>}
            </div>
          </section>

          {savedThemes.length > 0 && (
            <section className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
              <h2 className="text-sm font-semibold">Saved themes</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {savedThemes.map((saved) => (
                  <div key={saved.id} className="rounded-xl border p-3">
                    <PresetCard preset={saved} selected={draft.id === saved.id} onSelect={() => setDraft(saved)} />
                    <div className="mt-2 flex gap-2">
                      <Input defaultValue={saved.name} maxLength={48} aria-label={`Rename ${saved.name}`} onBlur={(event) => {
                        if (!event.target.value.trim() || event.target.value === saved.name) return
                        try {
                          renameTheme(saved.id, event.target.value)
                          setError("")
                        } catch (caught) {
                          event.target.value = saved.name
                          setError(caught instanceof Error ? caught.message : "Theme rename failed")
                        }
                      }} />
                      <Button variant="ghost" size="icon" aria-label={`Delete ${saved.name}`} onClick={() => { deleteTheme(saved.id); if (draft.id === saved.id) setDraft(themePresets[0]) }}><Trash2 /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        <aside className="min-w-0 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto xl:self-start">
          <div className="rounded-2xl border bg-card shadow-sm">
            <div className="border-b p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{draft.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Tune the system</p>
                </div>
                <span className="rounded-full border px-2 py-1 text-[10px] text-muted-foreground">{categoryLabels[draft.category]}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-b p-4 sm:p-5">
              <Button onClick={() => { applyTheme(draft); setError("") }}>Apply theme</Button>
              <Button variant="outline" onClick={saveCurrent}><Save /> Save locally</Button>
              <Button variant="outline" onClick={copyCss}>{copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy CSS"}</Button>
              <Button variant="outline" onClick={() => downloadFile(`${draft.id}.json`, themeToJson(draft), "application/json")}><Download /> Export JSON</Button>
              <Button className="col-span-2" variant="outline" onClick={() => downloadFile(`${draft.id}.registry.json`, `${JSON.stringify(themeToRegistry(draft), null, 2)}\n`, "application/json")}><Download /> Download for shadcn</Button>
              {isLedgerRecipe ? (
                <div className="col-span-2 rounded-lg bg-muted/50 p-2.5 text-[10px] leading-4 text-muted-foreground">
                  <span className="font-medium text-foreground">{ledgerDraftModified ? "Install this Ledger draft" : "Install the Ledger preset"}</span>
                  <code className="mt-1 block break-all">{ledgerDraftModified ? `bunx shadcn@latest add ./${draft.id}.registry.json` : "bunx shadcn@latest add https://ui.trysupervisor.com/r/theme-ledger.json"}</code>
                  <span className="mt-1 block">{ledgerDraftModified ? "Choose Download for shadcn, move the file into your app, and run this command. The file preserves your edits and installs the Ledger runtime." : "This registry item installs the palette, provider, components, chart, tokens, and styles. Copy CSS and Export JSON save palette settings only."}</span>
                  {ledgerDraftModified && <span className="mt-1 block">The published preset remains at <code className="break-all">https://ui.trysupervisor.com/r/theme-ledger.json</code>.</span>}
                  <Link href="/themes/ledger" className="mt-2 inline-flex items-center gap-1 text-foreground underline underline-offset-4">Read the Ledger guide <ExternalLink className="size-3" /></Link>
                </div>
              ) : (
                <div className="col-span-2 rounded-lg bg-muted/50 p-2.5 text-[10px] leading-4 text-muted-foreground">
                  <span className="font-medium text-foreground">Install in an existing app</span>
                  <code className="mt-1 block break-all">bunx shadcn@latest add ./{draft.id}.registry.json</code>
                  <span className="mt-1 block">Move the downloaded file into your app and run this command. It installs the theme and fonts through shadcn. Your components stay in place.</span>
                </div>
              )}
              {isLedgerRecipe && draft.font === "system-sans" ? (
                <div className="col-span-2 mt-1 rounded-lg bg-muted/50 p-2.5 text-[10px] leading-4 text-muted-foreground">
                  <span className="font-medium text-foreground">Native font setup</span>
                  <span className="mt-1 block">Ledger uses San Francisco on Apple devices, then system sans fallbacks. Its data face uses the native monospace stack. No font package is required.</span>
                </div>
              ) : (
                <div className="col-span-2 mt-1 rounded-lg bg-muted/50 p-2.5 text-[10px] leading-4 text-muted-foreground">
                  <span className="font-medium text-foreground">Font setup for CSS exports</span>
                  <code className="mt-1 block break-all">bun add {fontSetup.packageName}</code>
                  <code className="block break-all">{fontSetup.cssImport}</code>
                  <span className="mt-1 block">{fontSetup.usage}</span>
                </div>
              )}
            </div>

            <div className="space-y-6 p-4 sm:p-5">
              <div className="space-y-3">
                <label className="grid gap-1.5 text-xs font-medium">
                  Typeface
                  <select value={draft.font} onChange={(event) => patchDraft({ font: event.target.value as ThemeFontId })} className="h-8 rounded-lg border border-input bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring">
                    {FONT_OPTIONS.map((font) => <option key={font.id} value={font.id}>{font.label}</option>)}
                  </select>
                </label>
                <RangeControl label="Panel roundness" value={draft.radius} min={0} max={2} step={0.01} suffix="rem" onChange={(radius) => patchDraft({ radius })} />
                <RangeControl label="Button roundness" value={draft.buttonRadius ?? draft.radius} min={0} max={3.5} step={0.01} suffix="rem" onChange={(buttonRadius) => patchDraft({ buttonRadius })} />
                <RangeControl label="Button weight" value={draft.buttonWeight ?? 500} min={400} max={800} step={100} onChange={(buttonWeight) => patchDraft({ buttonWeight })} />
                <RangeControl label="Border" value={draft.borderWidth} min={0} max={3} step={0.25} suffix="px" onChange={(borderWidth) => patchDraft({ borderWidth })} />
                <RangeControl label="Spacing" value={draft.spacing} min={0.75} max={1.5} step={0.01} suffix="×" onChange={(spacing) => patchDraft({ spacing })} />
                <RangeControl label="Control height" value={draft.controlHeight} min={1.75} max={3.5} step={0.05} suffix="rem" onChange={(controlHeight) => patchDraft({ controlHeight })} />
                <RangeControl label="Text size" value={draft.textScale} min={0.875} max={1.25} step={0.025} suffix="×" onChange={(textScale) => patchDraft({ textScale })} />
                <RangeControl label="Shadow blur" value={draft.shadow.blur} min={0} max={64} step={1} suffix="px" onChange={(blur) => patchDraft({ shadow: { blur } })} />
                <RangeControl label="Shadow depth" value={draft.shadow.y} min={-24} max={24} step={1} suffix="px" onChange={(y) => patchDraft({ shadow: { y } })} />
                <RangeControl label="Shadow opacity" value={draft.shadow.opacity} min={0} max={0.5} step={0.01} onChange={(opacity) => patchDraft({ shadow: { opacity } })} />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium">{previewMode === "light" ? "Light" : "Dark"} palette</p>
                  <span className="text-[10px] text-muted-foreground">Hex colors</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {editableColors.map(({ key, label, pair }) => (
                    <label key={key} className="flex items-center gap-2 rounded-lg border p-2 text-[10px] text-muted-foreground">
                      <input type="color" value={draft[previewMode][key]} onChange={(event) => changeColor(key, event.target.value.toUpperCase(), pair)} className="size-6 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0" />
                      <span className="min-w-0">
                        <span className="block text-foreground">{label}</span>
                        <span className="block truncate font-mono">{draft[previewMode][key]}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
