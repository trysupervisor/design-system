import { brandThemePresets } from "./brand-theme-presets"
import { ledgerTheme } from "./ledger-theme"
import {
  parseTheme,
  type ThemeDefinition,
  type ThemeFontId,
  type ThemePalette,
} from "@/lib/theme"

type PresetSeed = {
  id: string
  name: string
  category: ThemeDefinition["category"]
  accent: string
  darkAccent?: string
  lightBackground?: string
  darkBackground?: string
  font?: ThemeFontId
  radius?: number
  borderWidth?: number
  spacing?: number
  controlHeight?: number
  textScale?: number
  shadow?: Partial<ThemeDefinition["shadow"]>
}

function parseHex(color: string) {
  return [1, 3, 5].map((index) => Number.parseInt(color.slice(index, index + 2), 16))
}

function toHex(channels: number[]) {
  return `#${channels.map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`.toUpperCase()
}

function mix(first: string, second: string, amount: number) {
  const a = parseHex(first)
  const b = parseHex(second)
  return toHex(a.map((channel, index) => channel + (b[index] - channel) * amount))
}

function bestText(background: string) {
  const [red, green, blue] = parseHex(background).map((channel) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
  const blackContrast = (luminance + 0.05) / 0.05
  const whiteContrast = 1.05 / (luminance + 0.05)
  return whiteContrast >= blackContrast ? "#FFFFFF" : "#000000"
}

function palette(seed: PresetSeed, dark: boolean): ThemePalette {
  const background = dark ? seed.darkBackground ?? "#0A0A0A" : seed.lightBackground ?? "#FFFFFF"
  const foreground = dark ? "#F2F2F2" : "#171717"
  const primary = dark ? seed.darkAccent ?? seed.accent : seed.accent
  const soft = mix(background, foreground, dark ? 0.1 : 0.055)
  const softer = mix(background, foreground, dark ? 0.07 : 0.035)
  const mutedForeground = mix(background, foreground, dark ? 0.72 : 0.64)
  const accent = mix(background, primary, dark ? 0.22 : 0.13)
  const border = mix(background, foreground, dark ? 0.18 : 0.13)
  const chartCompanion = dark ? "#60A5FA" : "#2563EB"
  const chartWarm = dark ? "#FBBF24" : "#D97706"
  const chartCool = dark ? "#34D399" : "#059669"
  const chartViolet = dark ? "#C084FC" : "#9333EA"
  const destructive = dark ? "#F04444" : "#C9252D"

  return {
    background,
    foreground,
    card: mix(background, foreground, dark ? 0.035 : 0.012),
    cardForeground: foreground,
    popover: mix(background, foreground, dark ? 0.05 : 0.008),
    popoverForeground: foreground,
    primary,
    primaryForeground: bestText(primary),
    secondary: soft,
    secondaryForeground: foreground,
    muted: soft,
    mutedForeground,
    accent,
    accentForeground: foreground,
    destructive,
    destructiveForeground: bestText(destructive),
    border,
    input: mix(background, foreground, dark ? 0.23 : 0.18),
    ring: primary,
    chart1: primary,
    chart2: chartCompanion,
    chart3: chartWarm,
    chart4: chartCool,
    chart5: chartViolet,
    sidebar: softer,
    sidebarForeground: foreground,
    sidebarPrimary: primary,
    sidebarPrimaryForeground: bestText(primary),
    sidebarAccent: accent,
    sidebarAccentForeground: foreground,
    sidebarBorder: border,
    sidebarRing: primary,
  }
}

function createPreset(seed: PresetSeed): ThemeDefinition {
  return parseTheme({
    schemaVersion: 1,
    id: seed.id,
    name: seed.name,
    category: seed.category,
    font: seed.font ?? "geist",
    radius: seed.radius ?? 0.5,
    borderWidth: seed.borderWidth ?? 1,
    spacing: seed.spacing ?? 1,
    controlHeight: seed.controlHeight ?? 2,
    textScale: seed.textScale ?? 1,
    shadow: {
      color: seed.shadow?.color ?? "#000000",
      opacity: seed.shadow?.opacity ?? 0.12,
      blur: seed.shadow?.blur ?? 12,
      spread: seed.shadow?.spread ?? 0,
      x: seed.shadow?.x ?? 0,
      y: seed.shadow?.y ?? 4,
    },
    light: palette(seed, false),
    dark: palette(seed, true),
  })
}

const geistDefault = parseTheme({
  schemaVersion: 1,
  id: "geist",
  name: "Geist",
  category: "neutral",
  font: "geist",
  radius: 0.375,
  borderWidth: 1,
  spacing: 1,
  controlHeight: 2.25,
  textScale: 1,
  shadow: { color: "#000000", opacity: 0, blur: 0, spread: 0, x: 0, y: 0 },
  light: {
    background: "#FAFAFA",
    foreground: "#171717",
    card: "#FFFFFF",
    cardForeground: "#171717",
    popover: "#FFFFFF",
    popoverForeground: "#171717",
    primary: "#171717",
    primaryForeground: "#FFFFFF",
    secondary: "#F2F2F2",
    secondaryForeground: "#171717",
    muted: "#F5F5F5",
    mutedForeground: "#4D4D4D",
    accent: "#EBEBEB",
    accentForeground: "#171717",
    destructive: "#C92B2B",
    destructiveForeground: "#FFFFFF",
    border: "#EAEAEA",
    input: "#D9D9D9",
    ring: "#737373",
    chart1: "#0070F3",
    chart2: "#38A169",
    chart3: "#EA7D20",
    chart4: "#8B5CF6",
    chart5: "#E83E8C",
    sidebar: "#FAFAFA",
    sidebarForeground: "#171717",
    sidebarPrimary: "#171717",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent: "#EBEBEB",
    sidebarAccentForeground: "#171717",
    sidebarBorder: "#EAEAEA",
    sidebarRing: "#737373",
  },
  dark: {
    background: "#000000",
    foreground: "#EDEDED",
    card: "#0A0A0A",
    cardForeground: "#EDEDED",
    popover: "#111111",
    popoverForeground: "#EDEDED",
    primary: "#EDEDED",
    primaryForeground: "#0A0A0A",
    secondary: "#1A1A1A",
    secondaryForeground: "#EDEDED",
    muted: "#171717",
    mutedForeground: "#A0A0A0",
    accent: "#242424",
    accentForeground: "#EDEDED",
    destructive: "#FF6666",
    destructiveForeground: "#171717",
    border: "#2E2E2E",
    input: "#363636",
    ring: "#A0A0A0",
    chart1: "#0070F3",
    chart2: "#38A169",
    chart3: "#EA7D20",
    chart4: "#8B5CF6",
    chart5: "#E83E8C",
    sidebar: "#0A0A0A",
    sidebarForeground: "#EDEDED",
    sidebarPrimary: "#EDEDED",
    sidebarPrimaryForeground: "#171717",
    sidebarAccent: "#1F1F1F",
    sidebarAccentForeground: "#EDEDED",
    sidebarBorder: "#2E2E2E",
    sidebarRing: "#A0A0A0",
  },
})

const presetSeeds: PresetSeed[] = [
  { id: "terminal-green", name: "Terminal Green", category: "technical", accent: "#087F23", darkAccent: "#56D364", lightBackground: "#F5F8F5", darkBackground: "#080D09", font: "ibm-plex-sans", radius: 0.14, borderWidth: 1.25 },
  { id: "syntax-blue", name: "Syntax Blue", category: "technical", accent: "#005FCC", darkAccent: "#6CB6FF", lightBackground: "#F7FAFC", darkBackground: "#08111D", font: "space-grotesk", radius: 0.3 },
  { id: "graphite", name: "Graphite", category: "neutral", accent: "#44474C", darkAccent: "#C9CDD2", lightBackground: "#F4F5F6", darkBackground: "#111315", font: "public-sans", radius: 0.4 },
  { id: "warm-stone", name: "Warm Stone", category: "neutral", accent: "#685D52", darkAccent: "#D4C6B8", lightBackground: "#F8F6F2", darkBackground: "#181512", font: "manrope", radius: 0.55 },
  { id: "carbon", name: "Carbon", category: "neutral", accent: "#30343B", darkAccent: "#E5E7EB", lightBackground: "#F3F4F6", darkBackground: "#090A0C", radius: 0.18, borderWidth: 1.25 },
  { id: "porcelain", name: "Porcelain", category: "soft", accent: "#7166B9", darkAccent: "#A99EF0", lightBackground: "#FBFAF8", darkBackground: "#16151A", font: "dm-sans", radius: 1 },
  { id: "sage", name: "Sage", category: "soft", accent: "#48775B", darkAccent: "#82B794", lightBackground: "#F5F8F2", darkBackground: "#101611", font: "lora", radius: 0.7 },
  { id: "lavender", name: "Lavender", category: "soft", accent: "#7559B8", darkAccent: "#B197FC", lightBackground: "#F9F7FD", darkBackground: "#15111C", font: "plus-jakarta-sans", radius: 0.88 },
  { id: "rosewater", name: "Rosewater", category: "soft", accent: "#B84368", darkAccent: "#F080A2", lightBackground: "#FFF7F9", darkBackground: "#1A1014", font: "outfit", radius: 1.15 },
  { id: "powder-blue", name: "Powder Blue", category: "soft", accent: "#3874A8", darkAccent: "#7DB8E8", lightBackground: "#F4F9FC", darkBackground: "#0D151B", font: "sora", radius: 0.8 },
  { id: "sunset", name: "Sunset", category: "colorful", accent: "#DB4C19", darkAccent: "#FF7A45", lightBackground: "#FFF8F3", darkBackground: "#1A0F0A", font: "outfit", radius: 0.7 },
  { id: "cobalt", name: "Cobalt", category: "colorful", accent: "#1856C9", darkAccent: "#6694FF", lightBackground: "#F5F8FF", darkBackground: "#081126", font: "space-grotesk", radius: 0.45 },
  { id: "plum", name: "Plum", category: "colorful", accent: "#8A3276", darkAccent: "#D978BF", lightBackground: "#FDF7FC", darkBackground: "#190F18", font: "dm-sans", radius: 0.65 },
  { id: "amber", name: "Amber", category: "colorful", accent: "#A85D00", darkAccent: "#F5A524", lightBackground: "#FFFAF0", darkBackground: "#191207", font: "manrope", radius: 0.42 },
  { id: "cyan", name: "Cyan", category: "colorful", accent: "#00758A", darkAccent: "#22C7E5", lightBackground: "#F2FBFC", darkBackground: "#071619", font: "plus-jakarta-sans", radius: 0.52 },
  { id: "cherry", name: "Cherry", category: "colorful", accent: "#B51E4A", darkAccent: "#F35D87", lightBackground: "#FFF7F9", darkBackground: "#1B0B10", font: "sora", radius: 0.58 },
  { id: "field-notes", name: "Field Notes", category: "editorial", accent: "#704C2A", darkAccent: "#C89B6D", lightBackground: "#F7F1E5", darkBackground: "#17120D", font: "lora", radius: 0.1, borderWidth: 1.25, textScale: 1.025 },
  { id: "modern-journal", name: "Modern Journal", category: "editorial", accent: "#9B2C2C", darkAccent: "#ED7777", lightBackground: "#FCFAF7", darkBackground: "#171412", font: "source-serif-4", radius: 0.18, textScale: 1.05 },
  { id: "gallery", name: "Gallery", category: "editorial", accent: "#31508A", darkAccent: "#8AA9E4", lightBackground: "#FAF9F6", darkBackground: "#111318", font: "public-sans", radius: 0, spacing: 1.1 },
  { id: "newsroom", name: "Newsroom", category: "editorial", accent: "#A72020", darkAccent: "#F07070", lightBackground: "#FAF9F5", darkBackground: "#141312", font: "source-serif-4", radius: 0, borderWidth: 1.5, spacing: 0.92 },
  { id: "architect", name: "Architect", category: "technical", accent: "#24615D", darkAccent: "#66B5AE", lightBackground: "#F4F6F5", darkBackground: "#0E1212", font: "ibm-plex-sans", radius: 0, borderWidth: 1.5, spacing: 0.88 },
  { id: "compact-data", name: "Compact Data", category: "technical", accent: "#3A5CCC", darkAccent: "#7895F5", lightBackground: "#F8F9FB", darkBackground: "#0B0E16", font: "inter", radius: 0.18, spacing: 0.78, controlHeight: 1.8, textScale: 0.9 },
  { id: "soft-focus", name: "Soft Focus", category: "soft", accent: "#7668A8", darkAccent: "#B7A8EC", lightBackground: "#FAF8FC", darkBackground: "#15121A", font: "manrope", radius: 1.4, spacing: 1.15, controlHeight: 2.35, shadow: { opacity: 0.1, blur: 24, y: 8 } },
  { id: "electric-violet", name: "Electric Violet", category: "colorful", accent: "#6D28D9", darkAccent: "#A78BFA", lightBackground: "#F8F6FF", darkBackground: "#100A1C", font: "space-grotesk", radius: 0.5 },
  { id: "mint-studio", name: "Mint Studio", category: "colorful", accent: "#087A5B", darkAccent: "#4ADEA7", lightBackground: "#F2FBF7", darkBackground: "#081511", font: "plus-jakarta-sans", radius: 0.72 },
]

export const themePresets = [geistDefault, ledgerTheme, ...brandThemePresets, ...presetSeeds.map(createPreset)]

export const defaultTheme = themePresets[0]

export function getThemePreset(id: string) {
  return themePresets.find((theme) => theme.id === id)
}
