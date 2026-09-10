"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { AIElementSlug } from "@/lib/ai-elements-catalog";

function LoadingPreview() {
  return <div className="h-48 w-full animate-pulse rounded-md bg-muted" role="status"><span className="sr-only">Loading preview</span></div>;
}

const previewLoaders = {
  agent: dynamic(() => import("./previews/agent"), { loading: LoadingPreview }),
  artifact: dynamic(() => import("./previews/artifact"), { loading: LoadingPreview }),
  attachments: dynamic(() => import("./previews/attachments"), { loading: LoadingPreview }),
  "audio-player": dynamic(() => import("./previews/audio-player"), { loading: LoadingPreview }),
  canvas: dynamic(() => import("./previews/canvas"), { loading: LoadingPreview, ssr: false }),
  "chain-of-thought": dynamic(() => import("./previews/chain-of-thought"), { loading: LoadingPreview }),
  checkpoint: dynamic(() => import("./previews/checkpoint"), { loading: LoadingPreview }),
  "code-block": dynamic(() => import("./previews/code-block"), { loading: LoadingPreview }),
  commit: dynamic(() => import("./previews/commit"), { loading: LoadingPreview }),
  confirmation: dynamic(() => import("./previews/confirmation"), { loading: LoadingPreview }),
  connection: dynamic(() => import("./previews/connection"), { loading: LoadingPreview, ssr: false }),
  context: dynamic(() => import("./previews/context"), { loading: LoadingPreview }),
  controls: dynamic(() => import("./previews/controls"), { loading: LoadingPreview, ssr: false }),
  conversation: dynamic(() => import("./previews/conversation"), { loading: LoadingPreview }),
  edge: dynamic(() => import("./previews/edge"), { loading: LoadingPreview, ssr: false }),
  "environment-variables": dynamic(() => import("./previews/environment-variables"), { loading: LoadingPreview }),
  "file-tree": dynamic(() => import("./previews/file-tree"), { loading: LoadingPreview }),
  image: dynamic(() => import("./previews/image"), { loading: LoadingPreview }),
  "inline-citation": dynamic(() => import("./previews/inline-citation"), { loading: LoadingPreview }),
  "jsx-preview": dynamic(() => import("./previews/jsx-preview"), { loading: LoadingPreview, ssr: false }),
  message: dynamic(() => import("./previews/message"), { loading: LoadingPreview }),
  "mic-selector": dynamic(() => import("./previews/mic-selector"), { loading: LoadingPreview, ssr: false }),
  "model-selector": dynamic(() => import("./previews/model-selector"), { loading: LoadingPreview }),
  node: dynamic(() => import("./previews/node"), { loading: LoadingPreview, ssr: false }),
  "open-in-chat": dynamic(() => import("./previews/open-in-chat"), { loading: LoadingPreview }),
  "package-info": dynamic(() => import("./previews/package-info"), { loading: LoadingPreview }),
  panel: dynamic(() => import("./previews/panel"), { loading: LoadingPreview, ssr: false }),
  persona: dynamic(() => import("./previews/persona"), { loading: LoadingPreview, ssr: false }),
  plan: dynamic(() => import("./previews/plan"), { loading: LoadingPreview }),
  "prompt-input": dynamic(() => import("./previews/prompt-input"), { loading: LoadingPreview }),
  queue: dynamic(() => import("./previews/queue"), { loading: LoadingPreview }),
  reasoning: dynamic(() => import("./previews/reasoning"), { loading: LoadingPreview }),
  sandbox: dynamic(() => import("./previews/sandbox"), { loading: LoadingPreview }),
  "schema-display": dynamic(() => import("./previews/schema-display"), { loading: LoadingPreview }),
  shimmer: dynamic(() => import("./previews/shimmer"), { loading: LoadingPreview }),
  snippet: dynamic(() => import("./previews/snippet"), { loading: LoadingPreview }),
  sources: dynamic(() => import("./previews/sources"), { loading: LoadingPreview }),
  "speech-input": dynamic(() => import("./previews/speech-input"), { loading: LoadingPreview, ssr: false }),
  "stack-trace": dynamic(() => import("./previews/stack-trace"), { loading: LoadingPreview }),
  suggestion: dynamic(() => import("./previews/suggestion"), { loading: LoadingPreview }),
  task: dynamic(() => import("./previews/task"), { loading: LoadingPreview }),
  terminal: dynamic(() => import("./previews/terminal"), { loading: LoadingPreview }),
  "test-results": dynamic(() => import("./previews/test-results"), { loading: LoadingPreview }),
  tool: dynamic(() => import("./previews/tool"), { loading: LoadingPreview }),
  toolbar: dynamic(() => import("./previews/toolbar"), { loading: LoadingPreview, ssr: false }),
  transcription: dynamic(() => import("./previews/transcription"), { loading: LoadingPreview }),
  "voice-selector": dynamic(() => import("./previews/voice-selector"), { loading: LoadingPreview }),
  "web-preview": dynamic(() => import("./previews/web-preview"), { loading: LoadingPreview }),
} satisfies Record<AIElementSlug, ComponentType>;

export function AIElementPreview({ slug }: { slug: string }) {
  const Preview = previewLoaders[slug as AIElementSlug];
  return Preview ? <Preview /> : null;
}
