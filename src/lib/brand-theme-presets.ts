import { parseTheme, type ThemeDefinition, type ThemePalette } from "./theme"

type BrandPalette = {
  background: string
  foreground: string
  card: string
  popover?: string
  primary: string
  primaryForeground: string
  secondary: string
  muted?: string
  mutedForeground: string
  accent?: string
  accentForeground?: string
  border: string
  input?: string
  ring: string
  sidebar: string
  sidebarAccent?: string
  destructive: string
  destructiveForeground: string
  charts: [string, string, string, string, string]
}

function semanticPalette(tokens: BrandPalette): ThemePalette {
  return {
    background: tokens.background,
    foreground: tokens.foreground,
    card: tokens.card,
    cardForeground: tokens.foreground,
    popover: tokens.popover ?? tokens.card,
    popoverForeground: tokens.foreground,
    primary: tokens.primary,
    primaryForeground: tokens.primaryForeground,
    secondary: tokens.secondary,
    secondaryForeground: tokens.foreground,
    muted: tokens.muted ?? tokens.secondary,
    mutedForeground: tokens.mutedForeground,
    accent: tokens.accent ?? tokens.secondary,
    accentForeground: tokens.accentForeground ?? tokens.foreground,
    destructive: tokens.destructive,
    destructiveForeground: tokens.destructiveForeground,
    border: tokens.border,
    input: tokens.input ?? tokens.border,
    ring: tokens.ring,
    chart1: tokens.charts[0],
    chart2: tokens.charts[1],
    chart3: tokens.charts[2],
    chart4: tokens.charts[3],
    chart5: tokens.charts[4],
    sidebar: tokens.sidebar,
    sidebarForeground: tokens.foreground,
    sidebarPrimary: tokens.primary,
    sidebarPrimaryForeground: tokens.primaryForeground,
    sidebarAccent: tokens.sidebarAccent ?? tokens.accent ?? tokens.secondary,
    sidebarAccentForeground: tokens.accentForeground ?? tokens.foreground,
    sidebarBorder: tokens.border,
    sidebarRing: tokens.ring,
  }
}

type BrandSeed = Pick<ThemeDefinition, "id" | "name" | "font" | "radius" | "controlHeight"> &
  Partial<Pick<ThemeDefinition, "category" | "headingFont" | "buttonFont" | "inputRadius" | "panelBorderWidth" | "buttonRadius" | "buttonWeight" | "spacing" | "borderWidth" | "textScale" | "shadow">> & {
    light: BrandPalette
    dark: BrandPalette
  }

function brandPreset(seed: BrandSeed): ThemeDefinition {
  return parseTheme({
    schemaVersion: 1,
    category: "brand",
    borderWidth: 1,
    spacing: 1,
    textScale: 1,
    shadow: { color: "#000000", opacity: 0, blur: 0, spread: 0, x: 0, y: 0 },
    ...seed,
    light: semanticPalette(seed.light),
    dark: semanticPalette(seed.dark),
  })
}


export const brandThemePresets = [
  brandPreset({
    id: "supervisor", name: "Supervisor", font: "system-sans", radius: 0.1875, buttonRadius: 0.3125, buttonWeight: 500, controlHeight: 2.75,
    light: { background: "#FFFFFF", foreground: "#000000", card: "#FFFFFF", primary: "#FF5125", primaryForeground: "#000000", secondary: "#F4F4F4", mutedForeground: "#666666", border: "#ECECEC", ring: "#1886E2", sidebar: "#FAFAFA", destructive: "#C9252D", destructiveForeground: "#FFFFFF", charts: ["#FF5125", "#1886E2", "#FFDD57", "#006C29", "#FFC8E4"] },
    dark: { background: "#000000", foreground: "#FFFFFF", card: "#080808", primary: "#FF5125", primaryForeground: "#000000", secondary: "#111111", mutedForeground: "#A3A3A3", border: "#1B1B1B", ring: "#1886E2", sidebar: "#000000", destructive: "#FF6666", destructiveForeground: "#000000", charts: ["#FF5125", "#1886E2", "#FFDD57", "#53B972", "#FFC8E4"] },
  }),
  brandPreset({
    id: "spotify-green", name: "Spotify", font: "dm-sans", radius: 0.5, buttonRadius: 3, buttonWeight: 700, controlHeight: 3,
    light: { background: "#FFFFFF", foreground: "#000000", card: "#F5F5F5", popover: "#FFFFFF", primary: "#1ED760", primaryForeground: "#000000", secondary: "#F0F0F0", mutedForeground: "#5A5A5A", accent: "#E9E9E9", border: "#DEDEDE", input: "#878787", ring: "#117A37", sidebar: "#F5F5F5", destructive: "#D31225", destructiveForeground: "#FFFFFF", charts: ["#1ED760", "#117A37", "#4687D6", "#8B63B8", "#777777"] },
    dark: { background: "#121212", foreground: "#FFFFFF", card: "#181818", popover: "#282828", primary: "#1ED760", primaryForeground: "#000000", secondary: "#282828", mutedForeground: "#B3B3B3", accent: "#333333", border: "#313131", input: "#727272", ring: "#FFFFFF", sidebar: "#000000", sidebarAccent: "#282828", destructive: "#F15E6C", destructiveForeground: "#000000", charts: ["#1ED760", "#62E38F", "#7AB1F1", "#B49ADA", "#B3B3B3"] },
  }),
  brandPreset({
    id: "netflix-red", name: "Netflix", font: "inter", radius: 0.5, inputRadius: 0.25, buttonRadius: 0.25, panelBorderWidth: 0, buttonWeight: 500, controlHeight: 2.5,
    light: { background: "#FFFFFF", foreground: "#141414", card: "#F5F5F5", popover: "#FFFFFF", primary: "#E50914", primaryForeground: "#FFFFFF", secondary: "#EEEEEE", mutedForeground: "#595959", border: "#D2D2D2", input: "#808080", ring: "#141414", sidebar: "#F5F5F5", destructive: "#B20710", destructiveForeground: "#FFFFFF", charts: ["#E50914", "#B20710", "#221F1F", "#777777", "#AAAAAA"] },
    dark: { background: "#000000", foreground: "#FFFFFF", card: "#232323", popover: "#161616", primary: "#E50914", primaryForeground: "#FFFFFF", secondary: "#232323", mutedForeground: "#B3B3B3", accent: "#333333", border: "#333333", input: "#606060", ring: "#FFFFFF", sidebar: "#000000", destructive: "#EB3942", destructiveForeground: "#000000", charts: ["#E50914", "#B20710", "#FFFFFF", "#B3B3B3", "#777777"] },
  }),
  brandPreset({
    id: "apple-clean", name: "Apple", font: "system-sans", radius: 0.75, buttonRadius: 3, buttonWeight: 400, controlHeight: 2.75,
    light: { background: "#FFFFFF", foreground: "#1D1D1F", card: "#FAFAFC", popover: "#FFFFFF", primary: "#0071E3", primaryForeground: "#FFFFFF", secondary: "#F5F5F7", mutedForeground: "#6E6E73", accent: "#E8E8ED", border: "#D2D2D7", ring: "#0071E3", sidebar: "#F5F5F7", destructive: "#C62828", destructiveForeground: "#FFFFFF", charts: ["#0071E3", "#248A3D", "#C93400", "#8944AB", "#D30F45"] },
    dark: { background: "#000000", foreground: "#F5F5F7", card: "#1D1D1F", popover: "#2C2C2E", primary: "#2997FF", primaryForeground: "#000000", secondary: "#1D1D1F", mutedForeground: "#A1A1A6", accent: "#2C2C2E", border: "#292929", input: "#424245", ring: "#2997FF", sidebar: "#1D1D1F", destructive: "#FF6961", destructiveForeground: "#000000", charts: ["#2997FF", "#30D158", "#FF9F0A", "#BF5AF2", "#FF375F"] },
  }),
  brandPreset({
    id: "openai-forest", name: "OpenAI", font: "manrope", radius: 0.375, inputRadius: 1.5, buttonRadius: 2.5, panelBorderWidth: 0, buttonWeight: 500, controlHeight: 2.25,
    light: { background: "#FFFFFF", foreground: "#000000", card: "#F9F9F9", popover: "#FFFFFF", primary: "#000000", primaryForeground: "#FFFFFF", secondary: "#F4F4F4", mutedForeground: "#5D5D5D", accent: "#ECECEC", border: "#E0E0E0", input: "#E0E0E0", ring: "#000000", sidebar: "#F9F9F9", destructive: "#B91C1C", destructiveForeground: "#FFFFFF", charts: ["#0D0D0D", "#5D5D5D", "#8F8F8F", "#B4B4B4", "#D5D5D5"] },
    dark: { background: "#212121", foreground: "#ECECEC", card: "#171717", popover: "#2F2F2F", primary: "#FFFFFF", primaryForeground: "#0D0D0D", secondary: "#2F2F2F", mutedForeground: "#B4B4B4", accent: "#3A3A3A", border: "#3C3C3C", input: "#4D4D4D", ring: "#ECECEC", sidebar: "#171717", destructive: "#F87171", destructiveForeground: "#000000", charts: ["#ECECEC", "#B4B4B4", "#8F8F8F", "#6F6F6F", "#515151"] },
  }),

  brandPreset({
    id: "anthropic", name: "Anthropic", font: "public-sans", headingFont: "source-serif-4", radius: 1, inputRadius: 0.5, buttonRadius: 0.5, panelBorderWidth: 0, buttonWeight: 400, controlHeight: 2.25,
    light: { background: "#FAF9F5", foreground: "#141413", card: "#E3DACC", popover: "#FAF9F5", primary: "#141413", primaryForeground: "#FAF9F5", secondary: "#F0EEE6", mutedForeground: "#64635D", accent: "#E3DACC", border: "#D6D3C9", input: "#AAA79E", ring: "#141413", sidebar: "#F0EEE6", destructive: "#AE3737", destructiveForeground: "#FFFFFF", charts: ["#D97757", "#141413", "#6B705C", "#9D8260", "#B4A892"] },
    dark: { background: "#1F1E1B", foreground: "#FAF9F5", card: "#302E29", popover: "#282722", primary: "#FAF9F5", primaryForeground: "#141413", secondary: "#2C2A25", mutedForeground: "#C4C0B5", accent: "#403B32", border: "#514D43", input: "#787366", ring: "#FAF9F5", sidebar: "#25241F", destructive: "#F08F86", destructiveForeground: "#141413", charts: ["#E5967A", "#FAF9F5", "#AFB49A", "#C6AC88", "#B4A892"] },
  }),
  brandPreset({
    id: "nixtla", name: "Nixtla", font: "ibm-plex-sans", buttonFont: "mono", radius: 0, inputRadius: 0, buttonRadius: 0, panelBorderWidth: 1, buttonWeight: 500, controlHeight: 3,
    light: { background: "#F6F4F0", foreground: "#222121", card: "#F6F4F0", popover: "#FFFFFF", primary: "#222121", primaryForeground: "#F6F4F0", secondary: "#EAE7E1", mutedForeground: "#62605A", accent: "#E0DDD5", border: "#222121", input: "#222121", ring: "#222121", sidebar: "#F6F4F0", destructive: "#A62E2E", destructiveForeground: "#FFFFFF", charts: ["#434E82", "#222121", "#6B7069", "#9A8468", "#97938C"] },
    dark: { background: "#222121", foreground: "#F6F4F0", card: "#292827", popover: "#333230", primary: "#F6F4F0", primaryForeground: "#222121", secondary: "#333230", mutedForeground: "#C1BDB4", accent: "#43413D", border: "#F6F4F0", input: "#F6F4F0", ring: "#F6F4F0", sidebar: "#222121", destructive: "#EE8989", destructiveForeground: "#222121", charts: ["#A0ABE2", "#F6F4F0", "#A7B0A4", "#C6AE8C", "#97938C"] },
  }),

  brandPreset({
    id: "notion-paper", name: "Notion", font: "system-sans", radius: 0.375, buttonRadius: 0.375, buttonWeight: 500, controlHeight: 2,
    light: { background: "#FFFFFF", foreground: "#37352F", card: "#FFFFFF", primary: "#2275C7", primaryForeground: "#FFFFFF", secondary: "#F7F6F3", mutedForeground: "#706F6A", accent: "#EFEFED", border: "#DFDEDC", input: "#D3D1CB", ring: "#2383E2", sidebar: "#F7F6F3", destructive: "#B73535", destructiveForeground: "#FFFFFF", charts: ["#2383E2", "#448361", "#D9730D", "#9065B0", "#C14C8A"] },
    dark: { background: "#191919", foreground: "#F0EFED", card: "#202020", popover: "#252525", primary: "#2383E2", primaryForeground: "#000000", secondary: "#202020", mutedForeground: "#ADA9A3", accent: "#2F2F2F", border: "#373737", input: "#505050", ring: "#2383E2", sidebar: "#202020", destructive: "#DF5452", destructiveForeground: "#000000", charts: ["#529CCA", "#6AAB8D", "#FFA344", "#B58ED1", "#E18AB5"] },
  }),
  brandPreset({
    id: "linear-purple", name: "Linear", font: "inter", radius: 0.5, buttonRadius: 0.375, buttonWeight: 500, controlHeight: 2,
    light: { background: "#F7F7F8", foreground: "#202124", card: "#FFFFFF", primary: "#5E6AD2", primaryForeground: "#FFFFFF", secondary: "#F1F1F2", mutedForeground: "#676970", accent: "#E9EAF4", border: "#E5E5E7", input: "#D8D9DE", ring: "#5E6AD2", sidebar: "#EDEEF0", destructive: "#C33743", destructiveForeground: "#FFFFFF", charts: ["#5E6AD2", "#26A67A", "#D7A340", "#B36ACC", "#C76774"] },
    dark: { background: "#0F0F10", foreground: "#EEEEF0", card: "#151516", popover: "#202022", primary: "#5E6AD2", primaryForeground: "#FFFFFF", secondary: "#1C1C1F", mutedForeground: "#8B8B90", accent: "#252631", border: "#27272A", input: "#37373C", ring: "#8A94EB", sidebar: "#111112", destructive: "#F16D7C", destructiveForeground: "#000000", charts: ["#8A94EB", "#4FC19C", "#E5BE67", "#CA91DF", "#DD8C98"] },
  }),
  brandPreset({
    id: "github-ink", name: "GitHub", font: "mona-sans", radius: 0.375, buttonRadius: 0.375, buttonWeight: 500, controlHeight: 2,
    shadow: { color: "#1F2328", opacity: 0.04, blur: 1, spread: 0, x: 0, y: 1 },
    light: { background: "#FFFFFF", foreground: "#1F2328", card: "#FFFFFF", primary: "#1F883D", primaryForeground: "#FFFFFF", secondary: "#F6F8FA", mutedForeground: "#59636E", accent: "#DDF4FF", border: "#D1D9E0", ring: "#0969DA", sidebar: "#F6F8FA", destructive: "#CF222E", destructiveForeground: "#FFFFFF", charts: ["#1F883D", "#0969DA", "#9A6700", "#8250DF", "#BF3989"] },
    dark: { background: "#0D1117", foreground: "#F0F6FC", card: "#0D1117", popover: "#161B22", primary: "#238636", primaryForeground: "#FFFFFF", secondary: "#151B23", mutedForeground: "#9198A1", accent: "#1C2D41", border: "#3D444D", ring: "#4493F8", sidebar: "#010409", destructive: "#F85149", destructiveForeground: "#000000", charts: ["#3FB950", "#4493F8", "#D29922", "#AB7DF8", "#DB61A2"] },
  }),
  brandPreset({
    id: "figma-coral", name: "Figma", font: "inter", radius: 0.5, buttonRadius: 0.375, buttonWeight: 500, controlHeight: 2,
    light: { background: "#FFFFFF", foreground: "#1A1A1A", card: "#FFFFFF", primary: "#0D99FF", primaryForeground: "#000000", secondary: "#F5F5F5", mutedForeground: "#6D6D6D", accent: "#E5F4FF", border: "#E6E6E6", input: "#B3B3B3", ring: "#007BE5", sidebar: "#F5F5F5", destructive: "#C52B20", destructiveForeground: "#FFFFFF", charts: ["#0D99FF", "#9747FF", "#14AE5C", "#F24822", "#FFCD29"] },
    dark: { background: "#2C2C2C", foreground: "#FFFFFF", card: "#383838", popover: "#383838", primary: "#0C8CE9", primaryForeground: "#000000", secondary: "#383838", mutedForeground: "#C3C3C3", accent: "#444444", border: "#444444", input: "#757575", ring: "#80CAFF", sidebar: "#2C2C2C", destructive: "#FF8F86", destructiveForeground: "#000000", charts: ["#0C8CE9", "#B68CFF", "#3CCB7F", "#FF8577", "#FFDF80"] },
  }),
  brandPreset({
    id: "vercel-mono", name: "Vercel", category: "technical", font: "geist", radius: 0.375, controlHeight: 2.25,
    light: { background: "#FFFFFF", foreground: "#171717", card: "#FFFFFF", primary: "#171717", primaryForeground: "#FFFFFF", secondary: "#F2F2F2", muted: "#FAFAFA", mutedForeground: "#4D4D4D", accent: "#EBEBEB", border: "#EAEAEA", input: "#C9C9C9", ring: "#171717", sidebar: "#FAFAFA", destructive: "#C9252D", destructiveForeground: "#FFFFFF", charts: ["#0070F3", "#46A758", "#F5A623", "#8E4EC6", "#E5484D"] },
    dark: { background: "#000000", foreground: "#EDEDED", card: "#0A0A0A", popover: "#1A1A1A", primary: "#EDEDED", primaryForeground: "#171717", secondary: "#1A1A1A", mutedForeground: "#A0A0A0", accent: "#1F1F1F", border: "#2E2E2E", input: "#454545", ring: "#EDEDED", sidebar: "#000000", destructive: "#FF6166", destructiveForeground: "#000000", charts: ["#52A8FF", "#63C174", "#FFB224", "#BF7AF0", "#FF6166"] },
  }),

]
