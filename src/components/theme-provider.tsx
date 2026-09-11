"use client"

import * as React from "react"
import { ledgerVariables } from "@/components/examples/registry/ledger-tokens"
import { mountLedgerTheme } from "@/components/examples/registry/ledger-runtime"

import {
  CUSTOM_THEMES_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  mergeTheme,
  parseTheme,
  safeParseTheme,
  themeSchema,
  themeVariables,
  type ThemeDefinition,
  type ThemeMode,
  type ThemePatch,
} from "@/lib/theme"
import { defaultTheme } from "@/lib/theme-presets"

type ThemeContextValue = {
  theme: ThemeDefinition
  mode: ThemeMode
  resolvedMode: "light" | "dark"
  savedThemes: ThemeDefinition[]
  ready: boolean
  setMode: (mode: ThemeMode) => void
  applyTheme: (theme: ThemeDefinition) => void
  updateTheme: (patch: ThemePatch) => void
  saveTheme: (theme?: ThemeDefinition) => ThemeDefinition
  renameTheme: (id: string, name: string) => void
  deleteTheme: (id: string) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function systemMode() {
  if (typeof window === "undefined") return "light" as const
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function loadSavedThemes() {
  if (typeof window === "undefined") return []
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY) ?? "[]")
    if (!Array.isArray(stored)) return []
    return stored.flatMap((value) => {
      const result = safeParseTheme(value)
      return result.success ? [result.data] : []
    })
  } catch {
    return []
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<ThemeDefinition>(defaultTheme)
  const [mode, setModeState] = React.useState<ThemeMode>("light")
  const [system, setSystem] = React.useState<"light" | "dark">("light")
  const [savedThemes, setSavedThemes] = React.useState<ThemeDefinition[]>([])
  const [ready, setReady] = React.useState(false)
  const resolvedMode = mode === "system" ? system : mode

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => setSystem(media.matches ? "dark" : "light")
    media.addEventListener("change", onChange)
    let active = true
    queueMicrotask(() => {
      if (!active) return
      setSystem(systemMode())
      try {
        const storedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY)
        if (storedMode === "light" || storedMode === "dark" || storedMode === "system") {
          setModeState(storedMode)
        }
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
        if (storedTheme) setTheme(parseTheme(JSON.parse(storedTheme)))
        setSavedThemes(loadSavedThemes())
      } catch {
        setTheme(defaultTheme)
      }
      setReady(true)
    })
    return () => {
      active = false
      media.removeEventListener("change", onChange)
    }
  }, [])

  React.useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme.id
    if (theme.recipe) root.dataset.themeRecipe = theme.recipe
    else delete root.dataset.themeRecipe
    root.classList.toggle("dark", resolvedMode === "dark")
    root.style.colorScheme = resolvedMode
    if (theme.recipe !== "ledger") {
      for (const name of Object.keys(ledgerVariables)) root.style.removeProperty(name)
    }
    const variables = themeVariables(theme, resolvedMode)
    for (const [name, value] of Object.entries(variables)) root.style.setProperty(name, value)
  }, [resolvedMode, theme])

  React.useEffect(() => {
    if (theme.recipe !== "ledger") return
    return mountLedgerTheme(document.documentElement)
  }, [theme.recipe])

  const setMode = React.useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode)
    localStorage.setItem(THEME_MODE_STORAGE_KEY, nextMode)
  }, [])

  const applyTheme = React.useCallback((nextTheme: ThemeDefinition) => {
    const parsed = parseTheme(nextTheme)
    setTheme(parsed)
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(parsed))
  }, [])

  const updateTheme = React.useCallback((patch: ThemePatch) => {
    setTheme((current) => {
      const next = mergeTheme(current, patch)
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const saveTheme = React.useCallback((nextTheme?: ThemeDefinition) => {
    const parsed = parseTheme(nextTheme ?? theme)
    setSavedThemes((current) => {
      const next = [...current.filter((saved) => saved.id !== parsed.id), parsed]
      localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(next))
      return next
    })
    return parsed
  }, [theme])

  const renameTheme = React.useCallback((id: string, name: string) => {
    const validName = themeSchema.shape.name.parse(name)
    setSavedThemes((current) => {
      const next = current.map((saved) => saved.id === id ? parseTheme({ ...saved, name: validName }) : saved)
      localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(next))
      return next
    })
    setTheme((current) => {
      if (current.id !== id) return current
      const next = parseTheme({ ...current, name: validName })
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const deleteTheme = React.useCallback((id: string) => {
    setSavedThemes((current) => {
      const next = current.filter((saved) => saved.id !== id)
      localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(next))
      return next
    })
    setTheme((current) => {
      if (current.id !== id) return current
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(defaultTheme))
      return defaultTheme
    })
  }, [])

  const value = React.useMemo<ThemeContextValue>(() => ({
    theme,
    mode,
    resolvedMode,
    savedThemes,
    ready,
    setMode,
    applyTheme,
    updateTheme,
    saveTheme,
    renameTheme,
    deleteTheme,
  }), [theme, mode, resolvedMode, savedThemes, ready, setMode, applyTheme, updateTheme, saveTheme, renameTheme, deleteTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used inside ThemeProvider")
  return context
}
