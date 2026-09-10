import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { jsonSchema, type LanguageModelUsage } from "ai";
import { SchemaDisplay, SchemaDisplayPath } from "../src/components/ai-elements/schema-display";
import { Context, ContextCacheUsage, ContextReasoningUsage } from "../src/components/ai-elements/context";
import { AgentTool, AgentTools } from "../src/components/ai-elements/agent";
import { highlightCode } from "../src/components/ai-elements/code-block";

describe("AI Elements compatibility", () => {
  test("schema paths escape HTML while highlighting parameters", () => {
    const path = '/files/{id}/<img src=x onerror="alert(1)"><script>alert(1)</script>';
    const markup = renderToStaticMarkup(<SchemaDisplay method="GET" path={path}><SchemaDisplayPath /></SchemaDisplay>);
    expect(markup).toContain("{id}</span>");
    expect(markup).toContain("&lt;img");
    expect(markup).toContain("&lt;script&gt;");
    expect(markup).not.toContain("<img");
    expect(markup).not.toContain("<script");
  });

  test("schema path children remain React nodes", () => {
    const markup = renderToStaticMarkup(<SchemaDisplayPath><strong>Custom path</strong></SchemaDisplayPath>);
    expect(markup).toContain("<strong>Custom path</strong>");
    expect(renderToStaticMarkup(<SchemaDisplayPath>{'<img src=x onerror="alert(1)">'}</SchemaDisplayPath>)).not.toContain("<img");
  });

  test("usage rows read SDK 7 reasoning and cached tokens", () => {
    const usage: LanguageModelUsage = {
      inputTokens: 100,
      outputTokens: 30,
      totalTokens: 130,
      inputTokenDetails: { noCacheTokens: 20, cacheReadTokens: 80, cacheWriteTokens: 0 },
      outputTokenDetails: { textTokens: 13, reasoningTokens: 17 },
    };
    const markup = renderToStaticMarkup(<Context usedTokens={130} maxTokens={1000} usage={usage}><ContextCacheUsage /><ContextReasoningUsage /></Context>);
    expect(markup).toContain("Cache");
    expect(markup).toContain("Reasoning");
    expect(markup).toContain("80");
    expect(markup).toContain("17");
  });

  test("dynamic tool descriptions are not executed without runtime context", () => {
    let called = false;
    const tool = { description: () => { called = true; return "Private context"; }, inputSchema: jsonSchema({ type: "object" }) };
    const markup = renderToStaticMarkup(<AgentTools type="single"><AgentTool value="tool" tool={tool} description="Read a document" /></AgentTools>);
    expect(markup).toContain("Read a document");
    expect(called).toBe(false);
  });

  test("async highlighting does not reuse tokens for different middle content", async () => {
    const prefix = `/* ${"a".repeat(110)} */\n`;
    const suffix = `\n/* ${"z".repeat(110)} */`;
    const first = `${prefix}const value = "first";${suffix}`;
    const second = `${prefix}const value = "other";${suffix}`;
    const highlight = (code: string) => new Promise<NonNullable<ReturnType<typeof highlightCode>>>((resolve) => {
      const cached = highlightCode(code, "typescript", resolve);
      if (cached) resolve(cached);
    });
    const firstResult = await highlight(first);
    const secondResult = await highlight(second);
    const text = (result: typeof firstResult) => result.tokens.map((line) => line.map((token) => token.content).join("")).join("\n");
    expect(text(firstResult)).toBe(first);
    expect(text(secondResult)).toBe(second);
  });
});
