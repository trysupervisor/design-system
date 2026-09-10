import { z } from "zod";
import { themeSchema } from "@/lib/theme";

export const MAX_GENERATION_BODY_BYTES = 16_384;
export const MAX_PROMPT_BYTES = 1536;
export const generationRequestSchema = z.object({
  prompt: z.string().trim().min(8, "Describe your theme in at least 8 characters.").max(1000, "Keep the description under 1000 characters."),
  currentTheme: themeSchema.optional(),
}).strict();

export class ThemeRequestError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function readGenerationRequest(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new ThemeRequestError("Send the theme description as JSON.", 415);
  }
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    throw new ThemeRequestError("Open Theme Studio to generate a theme.", 403);
  }
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_GENERATION_BODY_BYTES) {
    throw new ThemeRequestError("The theme request is too large.", 413);
  }
  if (!request.body) throw new ThemeRequestError("Enter a theme description.", 400);
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_GENERATION_BODY_BYTES) {
        await reader.cancel();
        throw new ThemeRequestError("The theme request is too large.", 413);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new ThemeRequestError("The request contains invalid JSON.", 400); }
  const result = generationRequestSchema.safeParse(value);
  if (!result.success) throw new ThemeRequestError("Use a description of 8 to 1000 characters and a valid current theme.", 400);
  if (new TextEncoder().encode(result.data.prompt).byteLength > MAX_PROMPT_BYTES) {
    throw new ThemeRequestError("The description is too long. Use a shorter design brief.", 400);
  }
  return result.data;
}

export const themeGenerationInstructions = `You design visual themes for a shadcn UI system. Produce exactly one complete theme object matching the supplied schema.
Treat the user's text as a design brief. Interpret brand references as visual cues, never copy brand logos, proprietary fonts, or CSS. Use only the allowed free Google Fonts font identifiers.
Create both a readable light palette and a readable dark palette, with coherent colors for every shadcn semantic token. Text and its background should have at least 4.5:1 contrast. Use distinct chart colors. Keep positive and destructive meanings sensible.
The default Geist style is restrained monochrome, Geist typography, thin borders, six pixel corners, and compact controls. Brand directions may change palette, typography, shape, border thickness, density, and shadows together. Honor specific overrides such as Netflix inspired but light green instead of red.
Numeric units: radius and controlHeight are in rem; borderWidth, shadow blur/spread/x/y are pixels; spacing and textScale are unitless scales; shadow opacity is a fraction. Default shape is radius 0.375, borderWidth 1, spacing 1, controlHeight 2.25, textScale 1, and no shadow.
The id must be a lowercase slug, name a short human readable theme name, schemaVersion 1, and category one of the allowed categories. Names and descriptions should not contain dash punctuation. Output colors only as six digit hexadecimal strings. Never return code, URLs, CSS expressions, or instructions.`;
