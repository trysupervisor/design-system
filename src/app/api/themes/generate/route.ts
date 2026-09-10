import { generateText, Output, APICallError } from "ai";
import { gateway, GatewayError } from "@ai-sdk/gateway";
import { checkRateLimit } from "@vercel/firewall";
import { parseTheme, themeSchema } from "@/lib/theme";
import { readGenerationRequest, ThemeRequestError, themeGenerationInstructions } from "@/lib/theme-generation";

export const runtime = "nodejs";
export const maxDuration = 60;

function response(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request: Request) {
  let phase = "request";
  try {
    const input = await readGenerationRequest(request);
    if (process.env.THEME_GENERATION_ENABLED !== "true") {
      return response({ error: "Theme generation is not configured yet. You can still edit every theme manually." }, 503);
    }
    if (process.env.VERCEL === "1") {
      phase = "request limits";
      const ipLimit = await checkRateLimit("theme-generation-ip", { request });
      if (ipLimit.error === "not-found") return response({ error: "Theme generation is temporarily unavailable." }, 503);
      if (ipLimit.rateLimited || ipLimit.error === "blocked") return response({ error: "You have reached the request limit. Try again in a minute." }, 429, { "Retry-After": "60" });
      const globalLimit = await checkRateLimit("theme-generation-global", { request, rateLimitKey: "design-system" });
      if (globalLimit.error === "not-found") return response({ error: "Theme generation is temporarily unavailable." }, 503);
      if (globalLimit.rateLimited || globalLimit.error === "blocked") return response({ error: "Theme generation is busy. Please try again later." }, 429, { "Retry-After": "3600" });
    }
    const model = process.env.AI_GATEWAY_MODEL || "openai/gpt-5.4-mini";
    phase = "generation";
    const result = await generateText({
      model: gateway(model),
      output: Output.object({ schema: themeSchema, name: "theme", description: "A complete shadcn theme with light and dark palettes and bounded visual settings." }),
      system: themeGenerationInstructions,
      prompt: `Design brief:\n${input.prompt}${input.currentTheme ? `\n\nCurrent theme to modify when relevant:\n${JSON.stringify(input.currentTheme)}` : ""}`,
      maxOutputTokens: 6000,
      maxRetries: 0,
      timeout: 50_000,
      abortSignal: request.signal,
      providerOptions: { gateway: { tags: ["design-system", "theme-generation"] }, openai: { reasoningEffort: "low" } },
    });
    phase = "theme validation";
    const theme = parseTheme({ ...result.output, id: `custom-${crypto.randomUUID()}` });
    return response({ theme, source: "model" });
  } catch (error) {
    if (error instanceof ThemeRequestError) return response({ error: error.message }, error.status);
    const status = APICallError.isInstance(error) || GatewayError.isInstance(error) ? error.statusCode : undefined;
    console.error("Theme generation failed", { phase, name: error instanceof Error ? error.name : "Unknown", status });
    if (status === 402) {
      return response({ error: "Theme generation has reached its usage budget. Presets and manual editing are still available." }, 503);
    }
    if (status === 429) {
      return response({ error: "Theme generation is busy. Try again shortly." }, 429, { "Retry-After": "60" });
    }
    return response({ error: "We could not create that theme. Try a shorter description or adjust the theme manually." }, 502);
  }
}
