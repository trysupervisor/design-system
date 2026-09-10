"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { AIElementSlug } from "@/lib/ai-elements-catalog";

type SnippetProps = { title: string };

const snippets = {
  "agent": dynamic(() => import("./snippets/agent")),
  "artifact": dynamic(() => import("./snippets/artifact")),
  "attachments": dynamic(() => import("./snippets/attachments")),
  "audio-player": dynamic(() => import("./snippets/audio-player")),
  "canvas": dynamic(() => import("./snippets/canvas")),
  "chain-of-thought": dynamic(() => import("./snippets/chain-of-thought")),
  "checkpoint": dynamic(() => import("./snippets/checkpoint")),
  "code-block": dynamic(() => import("./snippets/code-block")),
  "commit": dynamic(() => import("./snippets/commit")),
  "confirmation": dynamic(() => import("./snippets/confirmation")),
  "connection": dynamic(() => import("./snippets/connection")),
  "context": dynamic(() => import("./snippets/context")),
  "controls": dynamic(() => import("./snippets/controls")),
  "conversation": dynamic(() => import("./snippets/conversation")),
  "edge": dynamic(() => import("./snippets/edge")),
  "environment-variables": dynamic(() => import("./snippets/environment-variables")),
  "file-tree": dynamic(() => import("./snippets/file-tree")),
  "image": dynamic(() => import("./snippets/image")),
  "inline-citation": dynamic(() => import("./snippets/inline-citation")),
  "jsx-preview": dynamic(() => import("./snippets/jsx-preview")),
  "message": dynamic(() => import("./snippets/message")),
  "mic-selector": dynamic(() => import("./snippets/mic-selector")),
  "model-selector": dynamic(() => import("./snippets/model-selector")),
  "node": dynamic(() => import("./snippets/node")),
  "open-in-chat": dynamic(() => import("./snippets/open-in-chat")),
  "package-info": dynamic(() => import("./snippets/package-info")),
  "panel": dynamic(() => import("./snippets/panel")),
  "persona": dynamic(() => import("./snippets/persona")),
  "plan": dynamic(() => import("./snippets/plan")),
  "prompt-input": dynamic(() => import("./snippets/prompt-input")),
  "queue": dynamic(() => import("./snippets/queue")),
  "reasoning": dynamic(() => import("./snippets/reasoning")),
  "sandbox": dynamic(() => import("./snippets/sandbox")),
  "schema-display": dynamic(() => import("./snippets/schema-display")),
  "shimmer": dynamic(() => import("./snippets/shimmer")),
  "snippet": dynamic(() => import("./snippets/snippet")),
  "sources": dynamic(() => import("./snippets/sources")),
  "speech-input": dynamic(() => import("./snippets/speech-input")),
  "stack-trace": dynamic(() => import("./snippets/stack-trace")),
  "suggestion": dynamic(() => import("./snippets/suggestion")),
  "task": dynamic(() => import("./snippets/task")),
  "terminal": dynamic(() => import("./snippets/terminal")),
  "test-results": dynamic(() => import("./snippets/test-results")),
  "tool": dynamic(() => import("./snippets/tool")),
  "toolbar": dynamic(() => import("./snippets/toolbar")),
  "transcription": dynamic(() => import("./snippets/transcription")),
  "voice-selector": dynamic(() => import("./snippets/voice-selector")),
  "web-preview": dynamic(() => import("./snippets/web-preview")),
} satisfies Record<AIElementSlug, ComponentType<SnippetProps>>;

export function AIElementCode({ slug, title }: { slug: AIElementSlug; title: string }) {
  const Snippet = snippets[slug];
  return <Snippet title={title} />;
}
