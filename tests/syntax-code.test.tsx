import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import postcss from "postcss";
import { SyntaxCode, type CodeLanguage } from "../src/components/syntax-code";
import { contrastRatio } from "../src/lib/theme";

const samples: { language: CodeLanguage; code: string; tokens: string[] }[] = [
  { language: "tsx", code: 'const View = () => <Button disabled={false}>Save</Button>;', tokens: ["keyword", "tag", "attr-name", "boolean"] },
  { language: "css", code: ':root { color: #123456; font-family: "Geist"; }', tokens: ["selector", "property", "string"] },
  { language: "json", code: '{ "enabled": true, "count": 3, "name": "Theme" }', tokens: ["property", "boolean", "number", "string"] },
  { language: "sh", code: 'export NAME="Theme"\nbunx shadcn@latest add "$NAME" --yes # install', tokens: ["builtin", "string", "parameter", "comment"] },
];

function renderedText(markup: string) {
  return markup.replace(/<[^>]*>/g, "").replace(/&(amp|lt|gt|quot|#x27);/g, (_, entity: string) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#x27": "'" })[entity]!);
}

describe("syntax rendering", () => {
  for (const sample of samples) {
    test(`highlights ${sample.language} using real language tokens`, () => {
      const markup = renderToStaticMarkup(<SyntaxCode {...sample} label="Example code" />);
      for (const token of sample.tokens) expect(markup).toMatch(new RegExp(`class="token [^"]*\\b${token}\\b`));
      expect(renderedText(markup)).toBe(sample.code);
      expect(markup).toContain('tabindex="0"');
      expect(markup).toContain('aria-label="Example code"');
    });
  }

  test("preserves whitespace, empty lines, and original line endings", () => {
    for (const code of ["", "\n", "\n\n", "const a = 1;\r\n\r\n\tconst b = 2;\r\n", "  a\rb  "]) {
      expect(renderedText(renderToStaticMarkup(<SyntaxCode code={code} language="tsx" label="Source" />))).toBe(code);
    }
  });

  test("renders source as escaped text without executable HTML", () => {
    const code = '<script>alert("unsafe")</script> & <img src=x onerror=alert(1)>';
    const markup = renderToStaticMarkup(<SyntaxCode code={code} language="tsx" label="Source" />);
    expect(markup).not.toContain("<script>");
    expect(markup).not.toContain("<img ");
    expect(renderedText(markup)).toBe(code);
  });

  test("shell variables and operators receive tokens", () => {
    const markup = renderToStaticMarkup(<SyntaxCode code="echo $HOME && bun run build" language="sh" label="Command" />);
    expect(markup).toContain('class="token variable"');
    expect(markup).toContain('class="token operator"');
  });

  test("each token color meets normal text contrast in both modes", async () => {
    const stylesheet = postcss.parse(await Bun.file(new URL("../src/app/globals.css", import.meta.url)).text());
    for (const selector of [".syntax-highlight", ".dark .syntax-highlight"]) {
      const colors: Record<string, string> = {};
      stylesheet.walkRules(selector, (rule) => {
        rule.walkDecls(/^--syntax-/, (declaration) => { colors[declaration.prop] = declaration.value; });
      });
      expect(Object.keys(colors)).toHaveLength(7);
      for (const [property, color] of Object.entries(colors)) {
        if (property !== "--syntax-background") expect(contrastRatio(color, colors["--syntax-background"])).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
