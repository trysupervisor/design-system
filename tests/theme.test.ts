import { describe, expect, test } from "bun:test"

import {
  FONT_OPTIONS,
  LEDGER_NATIVE_MONO,
  LEDGER_NATIVE_SANS,
  fontIds,
  THEME_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  contrastRatio,
  importThemeJson,
  parseTheme,
  safeParseTheme,
  themeToCss,
  themeToJson,
  themeVariables,
  themeInitScript,
} from "../src/lib/theme"
import { ledgerVariables } from "../src/components/examples/registry/ledger-tokens"
import { ledgerTheme } from "../src/lib/ledger-theme"
import { defaultTheme, themePresets } from "../src/lib/theme-presets"
import { brandThemeReferences } from "../src/lib/brand-theme-references"
import { themeToRegistry } from "../src/lib/theme-registry"

describe("theme presets", () => {
  test("ships more than thirty unique validated themes", () => {
    expect(themePresets.length).toBeGreaterThanOrEqual(30)
    expect(new Set(themePresets.map((theme) => theme.id)).size).toBe(themePresets.length)
    for (const theme of themePresets) expect(parseTheme(theme)).toEqual(theme)
  })

  test("uses Geist by default and includes the Supervisor orange", () => {
    expect(defaultTheme.id).toBe("geist")
    expect(defaultTheme.font).toBe("geist")
    expect(themePresets.find((theme) => theme.id === "supervisor")?.light.primary).toBe("#FF5125")
  })

  test("includes Ledger with its stock dimensions and palette", () => {
    expect(themePresets).toContainEqual(ledgerTheme)
    expect(ledgerTheme).toMatchObject({
      id: "ledger",
      name: "Ledger",
      category: "soft",
      recipe: "ledger",
      font: "system-sans",
      radius: 0.875,
      buttonRadius: 0.875,
      borderWidth: 0,
      spacing: 1,
      controlHeight: 2.125,
      textScale: 1,
    })
    expect(ledgerTheme.light).toMatchObject({
      background: "#F3F3F3",
      card: "#FFFFFF",
      foreground: "#232323",
      muted: "#F8F8F8",
      primary: "#181818",
      secondary: "#272727",
      accent: "#F1F1F0",
      ring: "#ED514E",
    })
    expect(ledgerTheme.dark.background).toBe("#181818")
    expect(ledgerTheme.dark.card).toBe("#272727")
  })

  test("includes every approved font", () => {
    expect(FONT_OPTIONS.map((font) => font.id)).toEqual([...fontIds])
    expect(new Set(FONT_OPTIONS.map((font) => font.id)).size).toBe(14)
  })

  test("keeps researched brand identities through every export", () => {
    const github = themePresets.find((theme) => theme.id === "github-ink")!
    expect(github.font).toBe("mona-sans")
    expect(github.light.primary).toBe("#1F883D")
    expect(github.dark.background).toBe("#0D1117")
    expect(themeToRegistry(github).dependencies).toContain("@fontsource-variable/mona-sans")
    const spotify = themePresets.find((theme) => theme.id === "spotify-green")!
    expect(spotify.dark.primary).toBe("#1ED760")
    expect(spotify.font).toBe("dm-sans")
    expect(importThemeJson(themeToJson(spotify))).toEqual(spotify)
    expect(themeToCss(spotify)).toContain("--button-radius: 3rem;")
    expect(themeToRegistry(spotify).css[":root"]["--button-radius"]).toBe("3rem")
    expect(themeToRegistry(spotify).css[":root"]["--button-weight"]).toBe("700")
    expect(themeToRegistry(spotify).cssVars.light.radius).toBe("0.5rem")
    expect(themeVariables(spotify, "dark")["--button-radius"]).toBe("3rem")
    expect(themePresets.find((theme) => theme.id === "openai-forest")?.light.primary).toBe("#000000")
    expect(themePresets.find((theme) => theme.id === "figma-coral")?.light.primary).toBe("#0D99FF")
    for (const theme of themePresets.filter((theme) => theme.category === "brand" || ["geist", "vercel-mono"].includes(theme.id))) {
      const reference = brandThemeReferences[theme.id]
      expect(reference).toBeDefined()
      expect(reference.sources.length).toBeGreaterThan(0)
      expect(reference.typography.length).toBeGreaterThan(30)
      expect(reference.geometry.length).toBeGreaterThan(30)
      expect(reference.adaptation.length).toBeGreaterThan(30)
    }
  })

  test("keeps semantic foreground pairs readable", () => {
    const pairs = [
      ["background", "foreground", 4.5],
      ["card", "cardForeground", 4.5],
      ["popover", "popoverForeground", 4.5],
      ["primary", "primaryForeground", 4.5],
      ["secondary", "secondaryForeground", 4.5],
      ["muted", "mutedForeground", 4.5],
      ["accent", "accentForeground", 4.5],
      ["destructive", "destructiveForeground", 4.5],
      ["sidebar", "sidebarForeground", 4.5],
      ["sidebarPrimary", "sidebarPrimaryForeground", 4.5],
    ] as const
    for (const theme of themePresets) {
      for (const mode of ["light", "dark"] as const) {
        for (const [background, foreground, minimum] of pairs) {
          expect(contrastRatio(theme[mode][background], theme[mode][foreground])).toBeGreaterThanOrEqual(minimum)
        }
      }
    }
  })
})

describe("theme validation", () => {
  test("rejects unknown fields", () => {
    const result = safeParseTheme({ ...defaultTheme, css: "body { display: none }" })
    expect(result.success).toBe(false)
  })

  test("rejects CSS values and colors outside six digit hex", () => {
    expect(() => parseTheme({
      ...defaultTheme,
      light: { ...defaultTheme.light, background: "url(https://example.com/a.png)" },
    })).toThrow()
    expect(() => parseTheme({
      ...defaultTheme,
      light: { ...defaultTheme.light, background: "#FFF" },
    })).toThrow()
  })

  test("rejects fonts outside the allowlist and numeric overflow", () => {
    expect(() => parseTheme({ ...defaultTheme, font: "Comic Sans" })).toThrow()
    expect(() => parseTheme({ ...defaultTheme, radius: 20 })).toThrow()
    expect(() => parseTheme({ ...defaultTheme, buttonRadius: 20 })).toThrow()
    expect(() => parseTheme({ ...defaultTheme, buttonWeight: 1500 })).toThrow()
    expect(() => parseTheme({ ...defaultTheme, inputRadius: -1 })).toThrow()
    expect(() => parseTheme({ ...defaultTheme, panelBorderWidth: 4 })).toThrow()
    expect(() => parseTheme({ ...defaultTheme, headingFont: "unknown" })).toThrow()
    expect(() => parseTheme({ ...defaultTheme, buttonFont: "unknown" })).toThrow()
    expect(() => parseTheme({ ...defaultTheme, shadow: { ...defaultTheme.shadow, opacity: 0.9 } })).toThrow()
  })

  test("accepts only allowlisted recipes", () => {
    expect(parseTheme({ ...defaultTheme, recipe: "ledger" }).recipe).toBe("ledger")
    expect(() => parseTheme({ ...defaultTheme, recipe: "unknown" })).toThrow()
    expect(() => importThemeJson(JSON.stringify({ ...defaultTheme, recipe: { name: "ledger" } }))).toThrow()
  })

  test("accepts strict optional font and geometry fields", () => {
    expect(parseTheme({
      ...defaultTheme,
      headingFont: "source-serif-4",
      buttonFont: "mono",
      inputRadius: 1.25,
      panelBorderWidth: 0,
    })).toMatchObject({
      headingFont: "source-serif-4",
      buttonFont: "mono",
      inputRadius: 1.25,
      panelBorderWidth: 0,
    })
  })

  test("rejects unreadable foreground pairs", () => {
    expect(() => parseTheme({
      ...defaultTheme,
      light: { ...defaultTheme.light, foreground: "#FAFAFA" },
    })).toThrow(/contrast/)
  })

  test("rejects network URLs anywhere in an imported file", () => {
    const input = themeToJson({ ...defaultTheme, name: "https://example.com" })
    expect(() => importThemeJson(input)).toThrow(/network URLs/)
  })
})

describe("theme import and export", () => {
  test("round trips canonical JSON", () => {
    const lowerCase = {
      ...defaultTheme,
      shadow: { ...defaultTheme.shadow, color: "#aabbcc" },
      light: { ...defaultTheme.light, background: "#ffffff" },
    }
    const imported = importThemeJson(themeToJson(lowerCase))
    expect(imported.light.background).toBe("#FFFFFF")
    expect(imported.shadow.color).toBe("#AABBCC")
  })

  test("preserves distinct brand shapes and font roles in installable exports", () => {
    const anthropic = themePresets.find((theme) => theme.id === "anthropic")!
    expect(importThemeJson(themeToJson(anthropic))).toEqual(anthropic)
    const exported = themeToRegistry(anthropic)
    expect(exported.dependencies).toEqual(["@fontsource-variable/public-sans", "@fontsource-variable/source-serif-4", "@fontsource-variable/geist-mono"])
    expect(exported.css[":root"]["--heading-font"]).toContain("Source Serif 4")
    expect(exported.css[":root"]["--panel-border-width"]).toBe("0px")
    expect(exported.css[":root"]["--input-radius"]).toBe("0.5rem")
    expect(exported.cssVars.light.radius).toBe("1rem")
    const nixtla = themePresets.find((theme) => theme.id === "nixtla")!
    expect(themeToCss(nixtla)).toContain('--button-font: var(--font-mono, "Geist Mono Variable", monospace);')
    expect(themeToRegistry(nixtla).css[":root"]["--button-font"]).toContain("Geist Mono Variable")
    const openai = themePresets.find((theme) => theme.id === "openai-forest")!
    expect(themeVariables(openai, "light")["--input-radius"]).toBe("1.5rem")
    expect(themeVariables(openai, "light")["--radius"]).toBe("0.375rem")
  })

  test("exports complete shadcn variables for both modes", () => {
    const css = themeToCss(defaultTheme)
    expect(css).toContain(":root {")
    expect(css).toContain(".dark {")
    expect(css).toContain("--background: #FAFAFA;")
    expect(css).toContain("--sidebar-primary-foreground:")
    expect(css).toContain("--chart-5:")
    expect(css).toContain("--theme-shadow:")
    expect(css).toContain('--font-sans: var(--font-geist-sans, "GeistSans", ui-sans-serif, system-ui, sans-serif);')
    expect(css).not.toContain("url(")
  })

  test("returns the variables required by the live provider", () => {
    const variables = themeVariables(defaultTheme, "light")
    expect(variables["--font-sans"]).toBe("var(--font-geist-sans)")
    expect(variables["--spacing"]).toBe("0.25rem")
    expect(variables["--radius"]).toBe("0.375rem")
    expect(variables["--border-width"]).toBe("1px")
    expect(variables["--control-height"]).toBe("2.25rem")
    expect(variables["--text-scale"]).toBe("1")
    expect(variables["--theme-shadow"]).toBe("0px 0px 0px 0px rgba(0, 0, 0, 0)")
  })

  test("restores the saved theme before hydration", () => {
    const properties = new Map<string, string>()
    const classes = new Set<string>()
    const root = {
      dataset: {} as Record<string, string>,
      classList: {
        toggle(name: string, enabled: boolean) {
          if (enabled) classes.add(name)
          else classes.delete(name)
        },
      },
      style: {
        colorScheme: "",
        setProperty(name: string, value: string) {
          properties.set(name, value)
        },
      },
    }
    const storage = new Map([
      [THEME_MODE_STORAGE_KEY, "dark"],
      [THEME_STORAGE_KEY, JSON.stringify({ ...themePresets.find((theme) => theme.id === "supervisor"), inputRadius: 1.5, panelBorderWidth: 0, headingFont: "source-serif-4", buttonFont: "mono" })],
    ])
    const run = new Function("document", "localStorage", "matchMedia", themeInitScript)
    run(
      { documentElement: root },
      { getItem: (key: string) => storage.get(key) ?? null },
      () => ({ matches: false })
    )

    expect(root.dataset.theme).toBe("supervisor")
    expect(classes.has("dark")).toBe(true)
    expect(root.style.colorScheme).toBe("dark")
    expect(properties.get("--background")).toBe("#000000")
    expect(properties.get("--spacing")).toBe("0.25rem")
    expect(properties.get("--radius")).toBe("0.1875rem")
    expect(properties.get("--input-radius")).toBe("1.5rem")
    expect(properties.get("--panel-border-width")).toBe("0px")
    expect(properties.get("--heading-font")).toBe("var(--font-source-serif-4)")
    expect(properties.get("--button-font")).toContain("Geist Mono Variable")
    expect(properties.get("--button-radius")).toBe("0.3125rem")
    expect(properties.get("--button-weight")).toBe("500")
    expect(properties.get("--border-width")).toBe("1px")
    expect(properties.get("--control-height")).toBe("2.75rem")
    expect(properties.get("--text-scale")).toBe("1")
    expect(properties.get("--app-font")).toBe("var(--font-system-sans)")
    expect(properties.get("--theme-shadow")).toContain("rgba(0, 0, 0, 0)")
  })

  test("restores Ledger font roles before hydration", () => {
    const properties = new Map<string, string>()
    const root = {
      dataset: {} as Record<string, string>,
      classList: { toggle() {} },
      style: {
        colorScheme: "",
        setProperty(name: string, value: string) {
          properties.set(name, value)
        },
      },
    }
    const storedTheme = parseTheme({
      ...ledgerTheme,
      font: "inter",
      headingFont: "source-serif-4",
      buttonFont: "mono",
      inputRadius: 1.25,
      panelBorderWidth: 0,
    })
    const run = new Function("document", "localStorage", "matchMedia", themeInitScript)
    run(
      { documentElement: root },
      { getItem: (key: string) => key === THEME_STORAGE_KEY ? JSON.stringify(storedTheme) : null },
      () => ({ matches: false })
    )

    expect(root.dataset.theme).toBe("ledger")
    expect(properties.get("--app-font")).toBe("var(--font-inter)")
    expect(properties.get("--heading-font")).toBe("var(--font-source-serif-4)")
    expect(properties.get("--button-font")).toBe(LEDGER_NATIVE_MONO)
    expect(properties.get("--font-mono")).toBe(LEDGER_NATIVE_MONO)
    expect(properties.get("--ledger-font-body")).toBe("var(--font-inter)")
    expect(properties.get("--ledger-font-heading")).toBe("var(--font-source-serif-4)")
    expect(properties.get("--ledger-font-button")).toBe(LEDGER_NATIVE_MONO)
    expect(properties.get("--ledger-font-data")).toBe(LEDGER_NATIVE_MONO)
    expect(properties.get("--input-radius")).toBe("1.25rem")
    expect(properties.get("--panel-border-width")).toBe("0px")
  })

  test("legacy themes inherit their existing button shape and weight", () => {
    const imported = importThemeJson(themeToJson(defaultTheme))
    expect(imported.buttonRadius).toBeUndefined()
    expect(themeVariables(imported, "light")["--button-radius"]).toBe("0.375rem")
    expect(themeToRegistry(imported).css[":root"]["--button-weight"]).toBe("500")
    expect(themeVariables(imported, "light")["--input-radius"]).toBe("0.375rem")
    expect(themeVariables(imported, "light")["--panel-border-width"]).toBe("1px")
    expect(themeVariables(imported, "light")["--heading-font"]).toBe("var(--font-geist-sans)")
  })

  test("keeps legacy themes free of recipe output and resets the mono family", () => {
    const imported = importThemeJson(themeToJson(defaultTheme))
    expect(imported.recipe).toBeUndefined()
    expect(themeToCss(imported)).not.toContain("--ledger-")
    expect(themeVariables(imported, "light")["--font-mono"]).toBe("var(--font-geist-mono)")
    expect(themeToRegistry(imported).registryDependencies).toEqual([
      "https://ui.trysupervisor.com/r/supervisor-foundation.json",
    ])
  })

  test("preserves the Ledger recipe, native stacks, and portable tokens", () => {
    const imported = importThemeJson(themeToJson(ledgerTheme))
    expect(imported.recipe).toBe("ledger")

    const css = themeToCss(imported)
    expect(css).toContain(`--font-sans: ${LEDGER_NATIVE_SANS};`)
    expect(css).toContain(`--font-mono: ${LEDGER_NATIVE_MONO};`)

    const variables = themeVariables(imported, "light")
    expect(variables["--app-font"]).toBe(LEDGER_NATIVE_SANS)
    expect(variables["--font-sans"]).toBe(LEDGER_NATIVE_SANS)
    expect(variables["--font-mono"]).toBe(LEDGER_NATIVE_MONO)
    for (const [name, value] of Object.entries(ledgerVariables)) {
      expect(variables[name]).toBe(value)
      expect(css).toContain(`${name}: ${value};`)
    }

    const registry = themeToRegistry(imported)
    expect(registry.registryDependencies).toEqual([
      "https://ui.trysupervisor.com/r/ledger-runtime.json",
      "https://ui.trysupervisor.com/r/supervisor-foundation.json",
    ])
    expect(registry.dependencies).toEqual([])
    expect(registry.cssVars.theme["font-sans"]).toBe(LEDGER_NATIVE_SANS)
    expect(registry.cssVars.theme["font-mono"]).toBe(LEDGER_NATIVE_MONO)
    for (const [name, value] of Object.entries(ledgerVariables)) {
      expect(registry.css[":root"][name]).toBe(value)
    }
  })

  test("honors custom Ledger font roles", () => {
    const customized = parseTheme({
      ...ledgerTheme,
      font: "inter",
      headingFont: "source-serif-4",
      buttonFont: "mono",
    })
    expect(themeVariables(customized, "light")["--font-sans"]).toBe("var(--font-inter)")
    expect(themeVariables(customized, "light")["--font-mono"]).toBe(LEDGER_NATIVE_MONO)
    expect(themeVariables(customized, "light")["--heading-font"]).toBe("var(--font-source-serif-4)")
    expect(themeVariables(customized, "light")["--button-font"]).toBe(LEDGER_NATIVE_MONO)
    expect(themeVariables(customized, "light")["--ledger-font-body"]).toBe("var(--font-inter)")
    expect(themeVariables(customized, "light")["--ledger-font-heading"]).toBe("var(--font-source-serif-4)")
    expect(themeVariables(customized, "light")["--ledger-font-button"]).toBe(LEDGER_NATIVE_MONO)

    const bodyFamily = FONT_OPTIONS.find((font) => font.id === "inter")!.cssFamily
    const headingFamily = FONT_OPTIONS.find((font) => font.id === "source-serif-4")!.cssFamily
    const css = themeToCss(customized)
    expect(css).toContain(`--ledger-font-body: ${bodyFamily};`)
    expect(css).toContain(`--ledger-font-heading: ${headingFamily};`)
    expect(css).toContain(`--ledger-font-button: ${LEDGER_NATIVE_MONO};`)

    const registry = themeToRegistry(customized)
    expect(registry.dependencies).toEqual(["@fontsource-variable/inter", "@fontsource-variable/source-serif-4"])
    expect(registry.cssVars.theme["font-sans"]).toBe(bodyFamily)
    expect(registry.cssVars.theme["font-heading"]).toBe(headingFamily)
    expect(registry.cssVars.theme["font-mono"]).toBe(LEDGER_NATIVE_MONO)
    expect(registry.css[":root"]["--ledger-font-body"]).toBe(bodyFamily)
    expect(registry.css[":root"]["--ledger-font-heading"]).toBe(headingFamily)
    expect(registry.css[":root"]["--ledger-font-button"]).toBe(LEDGER_NATIVE_MONO)

    const geistRegistry = themeToRegistry(parseTheme({ ...ledgerTheme, font: "geist", headingFont: "geist", buttonFont: "body" }))
    const portableGeist = '"Geist Variable", ui-sans-serif, system-ui, sans-serif'
    expect(geistRegistry.dependencies).toEqual(["@fontsource-variable/geist"])
    expect(geistRegistry.cssVars.theme["font-sans"]).toBe(portableGeist)
    expect(geistRegistry.cssVars.theme["font-heading"]).toBe(portableGeist)
    expect(geistRegistry.css[":root"]["--button-font"]).toBe(portableGeist)
    expect(geistRegistry.css[":root"]["--ledger-font-body"]).toBe(portableGeist)
    expect(geistRegistry.css[":root"]["--ledger-font-heading"]).toBe(portableGeist)
    expect(geistRegistry.css[":root"]["--ledger-font-button"]).toBe(portableGeist)
  })
})
