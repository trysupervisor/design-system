import { __unstable__loadDesignSystem } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";
import { dirname, join } from "node:path";

const projectRoot = join(import.meta.dir, "..");
const packages = ["streamdown", "@streamdown/code", "@streamdown/math", "@streamdown/cjk", "@streamdown/mermaid"];
const semanticColors = ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground", "primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "muted-foreground", "accent", "accent-foreground", "destructive", "destructive-foreground", "border", "input", "ring"];

export async function streamdownRegistryCss(): Promise<Record<string, Record<string, string>>> {
  const scanner = new Scanner({
    sources: packages.map((name) => ({
      base: dirname(Bun.resolveSync(name, projectRoot)),
      pattern: "**/*.js",
      negated: false,
    })),
  });
  const candidates = scanner.scan().sort();
  const designSystem = await __unstable__loadDesignSystem(
    `@import "tailwindcss"; @theme inline { ${semanticColors.map((color) => `--color-${color}: var(--${color});`).join(" ")} }`,
    { base: projectRoot },
  );
  const compiled = designSystem.candidatesToCss(candidates);
  const valid = candidates.filter((_, index) => compiled[index] !== null);
  if (valid.length === 0) throw new Error("Streamdown packages produced no Tailwind utilities");
  if (valid.some((candidate) => /[{}"\\]/.test(candidate))) {
    throw new Error("Streamdown utilities require explicit inline source escaping");
  }
  return {
    '@import "streamdown/styles.css"': {},
    [`@source inline(${JSON.stringify(valid.join(" "))})`]: {},
  };
}
