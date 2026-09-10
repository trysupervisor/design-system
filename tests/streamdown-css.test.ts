import { describe, expect, test } from "bun:test";
import { compile } from "@tailwindcss/node";
import { join } from "node:path";
import { registryItemSchema } from "shadcn/schema";
import { streamdownRegistryCss } from "../scripts/streamdown-css";

const projectRoot = join(import.meta.dir, "..");
const rules = await streamdownRegistryCss();
const stylesheet = `@import "tailwindcss" source(none);\n@theme inline { --color-muted: var(--muted); --color-muted-foreground: var(--muted-foreground); }\n${Object.keys(rules).map((rule) => `${rule};`).join("\n")}`;

describe("Streamdown registry CSS", () => {
  test("uses valid native CSS metadata without consumer paths or JavaScript noise", () => {
    expect(registryItemSchema.safeParse({ name: "streamdown-styles", type: "registry:style", css: rules }).success).toBe(true);
    expect(rules['@import "streamdown/styles.css"']).toEqual({});
    const inline = Object.keys(rules).find((key) => key.startsWith("@source inline("))!;
    expect(inline).not.toContain("node_modules");
    expect(inline).not.toContain("useEffect");
    expect(inline).not.toContain("createElement");
    expect(inline).toContain("text-muted-foreground");
  });

  for (const directory of ["app", "src/app", "src/custom/deep/styles"]) {
    test(`compiles markdown utilities with CSS under ${directory}`, async () => {
      const compiler = await compile(stylesheet, { base: join(projectRoot, directory), onDependency() {} });
      const output = compiler.build([]);
      expect(output).toContain(".list-disc");
      expect(output).toContain(".list-decimal");
      expect(output).toContain(".text-muted-foreground");
      expect(output).toContain("@keyframes sd-fadeIn");
    });
  }
});
