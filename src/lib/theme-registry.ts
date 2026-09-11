import {
  FONT_OPTIONS,
  LEDGER_NATIVE_MONO,
  LEDGER_NATIVE_SANS,
  parseTheme,
  shadowToCss,
  themeVariables,
  type ThemeDefinition,
} from "./theme";

export const REGISTRY_URL = "https://ui.trysupervisor.com/r";

export function hexToHslChannels(hex: string) {
  const [red, green, blue] = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const difference = maximum - minimum;
  const lightness = (maximum + minimum) / 2;
  let hue = 0;
  if (difference) {
    if (maximum === red) hue = ((green - blue) / difference) % 6;
    else if (maximum === green) hue = (blue - red) / difference + 2;
    else hue = (red - green) / difference + 4;
    hue = (hue * 60 + 360) % 360;
  }
  const saturation = difference ? difference / (1 - Math.abs(2 * lightness - 1)) : 0;
  return `${Number(hue.toFixed(5))} ${Number((saturation * 100).toFixed(5))}% ${Number((lightness * 100).toFixed(5))}%`;
}

export function themeToRegistry(themeInput: ThemeDefinition, baseUrl = REGISTRY_URL, name?: string) {
  const theme = parseTheme(themeInput);
  const isLedger = theme.recipe === "ledger";
  const font = FONT_OPTIONS.find((option) => option.id === theme.font)!;
  const headingFont = FONT_OPTIONS.find((option) => option.id === (theme.headingFont ?? theme.font))!;
  const familyFor = (option: typeof font) => isLedger && option.id === "system-sans"
    ? LEDGER_NATIVE_SANS
    : option.id === "geist" ? '"Geist Variable", ui-sans-serif, system-ui, sans-serif' : option.cssFamily;
  const packageFor = (option: typeof font) => isLedger && option.id === "system-sans"
    ? undefined
    : option.id === "geist" ? "@fontsource-variable/geist" : option.packageName;
  const family = familyFor(font);
  const headingFamily = familyFor(headingFont);
  const monoFamily = isLedger ? LEDGER_NATIVE_MONO : '"Geist Mono Variable", ui-monospace, monospace';
  const buttonFamily = theme.buttonFont === "mono" ? monoFamily : family;
  const monoPackage = isLedger ? undefined : "@fontsource-variable/geist-mono";
  const fontPackages = [...new Set([packageFor(font), packageFor(headingFont), monoPackage].filter((packageName): packageName is string => Boolean(packageName)))];
  const palette = (mode: "light" | "dark") => {
    const variables: Record<string, string> = {};
    const rules: Record<string, string> = {};
    for (const [key, value] of Object.entries(themeVariables(theme, mode))) {
      const token = key.slice(2);
      if (token === "font-sans" || token === "font-mono") continue;
      if (/^#[0-9a-f]{6}$/i.test(value) && token !== "shadow-color" && !token.startsWith("ledger-")) {
        variables[token] = hexToHslChannels(value);
      } else if (token === "radius") {
        variables[token] = value;
      } else {
        rules[key] = value;
      }
    }
    rules["--app-font"] = family;
    rules["--heading-font"] = headingFamily;
    rules["--button-font"] = buttonFamily;
    if (isLedger) {
      rules["--ledger-font-body"] = family;
      rules["--ledger-font-heading"] = headingFamily;
      rules["--ledger-font-button"] = buttonFamily;
      rules["--ledger-font-data"] = LEDGER_NATIVE_MONO;
    }
    variables["sidebar-background"] = variables.sidebar;
    rules["--theme-shadow"] = shadowToCss(theme.shadow);
    return { variables, rules };
  };
  const light = palette("light");
  const dark = palette("dark");
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: name ?? `theme-${theme.id}`,
    type: "registry:theme" as const,
    title: theme.name,
    description: `${theme.name} colors, typography, spacing, borders, and shadows for shadcn.`,
    registryDependencies: [
      ...(isLedger ? [`${baseUrl}/ledger-runtime.json`] : []),
      `${baseUrl}/supervisor-foundation.json`,
    ],
    dependencies: fontPackages,
    cssVars: {
      theme: { "font-sans": family, "font-heading": headingFamily, "font-mono": monoFamily, "shadow-sm": "var(--theme-shadow)" },
      light: light.variables,
      dark: dark.variables,
    },
    css: {
      ...Object.fromEntries(fontPackages.map((packageName) => [`@import "${packageName}"`, {}])),
      ":root": light.rules,
      ".dark": dark.rules,
    },
    tailwind: {
      config: {
        theme: {
          extend: {
            fontFamily: {
              sans: ["var(--app-font)"],
              heading: ["var(--heading-font)"],
              mono: isLedger ? ["SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace"] : ["Geist Mono Variable", "monospace"],
            },
            borderRadius: { sm: "calc(var(--radius) * .6)", md: "calc(var(--radius) * .8)", lg: "var(--radius)", xl: "calc(var(--radius) * 1.4)" },
            spacing: Object.fromEntries([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96].map((size) => [String(size), `calc(var(--spacing) * ${size})`])),
            boxShadow: { sm: "var(--theme-shadow)" },
          },
        },
      },
    },
    docs: isLedger
      ? "Ledger runtime and Supervisor foundation are installed with this theme. Existing components and their APIs are preserved. Use your existing dark mode switch."
      : "Theme installed in your configured stylesheet. Existing components and their APIs are preserved. Use your existing dark mode switch.",
  };
}
