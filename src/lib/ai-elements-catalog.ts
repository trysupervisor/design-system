export const AI_ELEMENTS_UPSTREAM_REVISION = "6a9d5b1822ffb10bba4bd97175f01edd7d8651cd";
export const AI_ELEMENTS_SOURCE_URL = "https://github.com/vercel/ai-elements/tree/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src";

export const AI_ELEMENT_CATEGORIES = ["chatbot","code","utilities","voice","workflow"] as const;

export type AIElementCategory = (typeof AI_ELEMENT_CATEGORIES)[number];

export type AIElementMetadata = {
  slug: string;
  name: string;
  description: string;
  category: AIElementCategory;
  registryUrl: string;
  dependencies: readonly string[];
  registryDependencies: readonly string[];
};

export const AI_ELEMENTS = [
  {
    "category": "code",
    "dependencies": [
      "ai",
      "lucide-react"
    ],
    "description": "Shows an agent model, instructions, tools, and output schema.",
    "name": "Agent",
    "registryDependencies": [
      "accordion",
      "badge",
      "https://elements.ai-sdk.dev/api/registry/code-block.json"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/agent.json",
    "slug": "agent"
  },
  {
    "category": "code",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Frames generated code or documents with header actions.",
    "name": "Artifact",
    "registryDependencies": [
      "button",
      "tooltip"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/artifact.json",
    "slug": "artifact"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "ai",
      "lucide-react"
    ],
    "description": "Renders file, image, video, audio, and source attachments.",
    "name": "Attachments",
    "registryDependencies": [
      "button",
      "hover-card"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/attachments.json",
    "slug": "attachments"
  },
  {
    "category": "voice",
    "dependencies": [
      "ai",
      "media-chrome"
    ],
    "description": "Plays audio through media-chrome controls.",
    "name": "Audio Player",
    "registryDependencies": [
      "button",
      "button-group"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/audio-player.json",
    "slug": "audio-player"
  },
  {
    "category": "workflow",
    "dependencies": [
      "@xyflow/react"
    ],
    "description": "Hosts an interactive React Flow canvas.",
    "name": "Canvas",
    "registryDependencies": [],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/canvas.json",
    "slug": "canvas"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "@radix-ui/react-use-controllable-state",
      "lucide-react"
    ],
    "description": "Groups reasoning steps, search results, and images in a collapsible timeline.",
    "name": "Chain of Thought",
    "registryDependencies": [
      "badge",
      "collapsible"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/chain-of-thought.json",
    "slug": "chain-of-thought"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Marks a point that a conversation can restore.",
    "name": "Checkpoint",
    "registryDependencies": [
      "button",
      "separator",
      "tooltip"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/checkpoint.json",
    "slug": "checkpoint"
  },
  {
    "category": "code",
    "dependencies": [
      "lucide-react",
      "shiki"
    ],
    "description": "Highlights code with optional line numbers and copy action.",
    "name": "Code Block",
    "registryDependencies": [
      "button",
      "select"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/code-block.json",
    "slug": "code-block"
  },
  {
    "category": "code",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Shows a commit hash, message, author, and file changes.",
    "name": "Commit",
    "registryDependencies": [
      "avatar",
      "button",
      "collapsible"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/commit.json",
    "slug": "commit"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "ai"
    ],
    "description": "Collects approval or rejection for a tool call.",
    "name": "Confirmation",
    "registryDependencies": [
      "alert",
      "button"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/confirmation.json",
    "slug": "confirmation"
  },
  {
    "category": "workflow",
    "dependencies": [
      "@xyflow/react"
    ],
    "description": "Draws an animated connection while linking React Flow nodes.",
    "name": "Connection",
    "registryDependencies": [],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/connection.json",
    "slug": "connection"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "ai",
      "tokenlens"
    ],
    "description": "Reports model context usage, token counts, and estimated cost.",
    "name": "Context",
    "registryDependencies": [
      "button",
      "hover-card",
      "progress"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/context.json",
    "slug": "context"
  },
  {
    "category": "workflow",
    "dependencies": [
      "@xyflow/react"
    ],
    "description": "Adds zoom and fit controls to a React Flow canvas.",
    "name": "Controls",
    "registryDependencies": [],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/controls.json",
    "slug": "controls"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "ai",
      "lucide-react",
      "use-stick-to-bottom"
    ],
    "description": "Keeps a message stream scrolled and offers a return button.",
    "name": "Conversation",
    "registryDependencies": [
      "button"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/conversation.json",
    "slug": "conversation"
  },
  {
    "category": "workflow",
    "dependencies": [
      "@xyflow/react"
    ],
    "description": "Draws persistent or temporary React Flow edges.",
    "name": "Edge",
    "registryDependencies": [],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/edge.json",
    "slug": "edge"
  },
  {
    "category": "code",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Masks, reveals, and copies environment variables.",
    "name": "Environment Variables",
    "registryDependencies": [
      "badge",
      "button",
      "switch"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/environment-variables.json",
    "slug": "environment-variables"
  },
  {
    "category": "code",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Displays an expandable file and folder tree.",
    "name": "File Tree",
    "registryDependencies": [
      "collapsible"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/file-tree.json",
    "slug": "file-tree"
  },
  {
    "category": "utilities",
    "dependencies": [
      "ai"
    ],
    "description": "Displays images returned by the AI SDK.",
    "name": "Image",
    "registryDependencies": [],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/image.json",
    "slug": "image"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Links response text to source details and quoted evidence.",
    "name": "Inline Citation",
    "registryDependencies": [
      "badge",
      "carousel",
      "hover-card"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/inline-citation.json",
    "slug": "inline-citation"
  },
  {
    "category": "code",
    "dependencies": [
      "lucide-react",
      "react-jsx-parser"
    ],
    "description": "Renders a streamed JSX string as React content.",
    "name": "JSX Preview",
    "registryDependencies": [],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/jsx-preview.json",
    "slug": "jsx-preview"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "@streamdown/cjk",
      "@streamdown/code",
      "@streamdown/math",
      "@streamdown/mermaid",
      "ai",
      "lucide-react",
      "streamdown"
    ],
    "description": "Renders chat messages, branches, actions, and Markdown responses.",
    "name": "Message",
    "registryDependencies": [
      "button",
      "button-group",
      "tooltip"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/message.json",
    "slug": "message"
  },
  {
    "category": "voice",
    "dependencies": [
      "@radix-ui/react-use-controllable-state",
      "lucide-react"
    ],
    "description": "Selects an audio input and tracks permission or device changes.",
    "name": "Mic Selector",
    "registryDependencies": [
      "button",
      "command",
      "popover"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/mic-selector.json",
    "slug": "mic-selector"
  },
  {
    "category": "chatbot",
    "dependencies": [],
    "description": "Searches and selects an AI model.",
    "name": "Model Selector",
    "registryDependencies": [
      "command",
      "dialog"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/model-selector.json",
    "slug": "model-selector"
  },
  {
    "category": "workflow",
    "dependencies": [
      "@xyflow/react"
    ],
    "description": "Builds a card shaped node for React Flow.",
    "name": "Node",
    "registryDependencies": [
      "card"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/node.json",
    "slug": "node"
  },
  {
    "category": "utilities",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Opens a query in ChatGPT, Claude, T3, Scira, or v0.",
    "name": "Open In Chat",
    "registryDependencies": [
      "button",
      "dropdown-menu"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/open-in-chat.json",
    "slug": "open-in-chat"
  },
  {
    "category": "code",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Shows a package version and dependency changes.",
    "name": "Package Info",
    "registryDependencies": [
      "badge"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/package-info.json",
    "slug": "package-info"
  },
  {
    "category": "workflow",
    "dependencies": [
      "@xyflow/react"
    ],
    "description": "Positions custom controls over a React Flow canvas.",
    "name": "Panel",
    "registryDependencies": [],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/panel.json",
    "slug": "panel"
  },
  {
    "category": "voice",
    "dependencies": [
      "@rive-app/react-webgl2"
    ],
    "description": "Animates a Rive persona for listening, thinking, and speaking states.",
    "name": "Persona",
    "registryDependencies": [],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/persona.json",
    "slug": "persona"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Shows a streamed execution plan in a collapsible panel.",
    "name": "Plan",
    "registryDependencies": [
      "button",
      "card",
      "collapsible",
      "https://elements.ai-sdk.dev/api/registry/shimmer.json"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/plan.json",
    "slug": "plan"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "ai",
      "lucide-react",
      "nanoid"
    ],
    "description": "Collects a prompt, attachments, and model selection for submission.",
    "name": "Prompt Input",
    "registryDependencies": [
      "command",
      "dropdown-menu",
      "hover-card",
      "input-group",
      "select",
      "spinner",
      "tooltip"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/prompt-input.json",
    "slug": "prompt-input"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Displays queued messages, tasks, and todo items.",
    "name": "Queue",
    "registryDependencies": [
      "button",
      "collapsible",
      "scroll-area"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/queue.json",
    "slug": "queue"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "@radix-ui/react-use-controllable-state",
      "@streamdown/cjk",
      "@streamdown/code",
      "@streamdown/math",
      "@streamdown/mermaid",
      "lucide-react",
      "streamdown"
    ],
    "description": "Shows streamed reasoning in an automatically managed disclosure.",
    "name": "Reasoning",
    "registryDependencies": [
      "collapsible",
      "https://elements.ai-sdk.dev/api/registry/shimmer.json"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/reasoning.json",
    "slug": "reasoning"
  },
  {
    "category": "code",
    "dependencies": [
      "ai",
      "lucide-react"
    ],
    "description": "Pairs generated code with its execution output.",
    "name": "Sandbox",
    "registryDependencies": [
      "collapsible",
      "https://elements.ai-sdk.dev/api/registry/tool.json",
      "tabs"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/sandbox.json",
    "slug": "sandbox"
  },
  {
    "category": "code",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Documents REST parameters and request or response bodies.",
    "name": "Schema Display",
    "registryDependencies": [
      "badge",
      "collapsible"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/schema-display.json",
    "slug": "schema-display"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "motion"
    ],
    "description": "Animates text during loading or progressive reveal.",
    "name": "Shimmer",
    "registryDependencies": [],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/shimmer.json",
    "slug": "shimmer"
  },
  {
    "category": "code",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Displays a terminal command or short code reference inline.",
    "name": "Snippet",
    "registryDependencies": [
      "input-group"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/snippet.json",
    "slug": "snippet"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Lists the citations used to produce a response.",
    "name": "Sources",
    "registryDependencies": [
      "collapsible"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/sources.json",
    "slug": "sources"
  },
  {
    "category": "voice",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Captures speech and returns transcribed text.",
    "name": "Speech Input",
    "registryDependencies": [
      "button",
      "spinner"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/speech-input.json",
    "slug": "speech-input"
  },
  {
    "category": "code",
    "dependencies": [
      "@radix-ui/react-use-controllable-state",
      "lucide-react"
    ],
    "description": "Formats JavaScript and Node.js stack frames with syntax highlighting.",
    "name": "Stack Trace",
    "registryDependencies": [
      "button",
      "collapsible"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/stack-trace.json",
    "slug": "stack-trace"
  },
  {
    "category": "chatbot",
    "dependencies": [],
    "description": "Presents a horizontal list of selectable prompt suggestions.",
    "name": "Suggestion",
    "registryDependencies": [
      "button",
      "scroll-area"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/suggestion.json",
    "slug": "suggestion"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Shows workflow tasks with status and optional detail.",
    "name": "Task",
    "registryDependencies": [
      "collapsible"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/task.json",
    "slug": "task"
  },
  {
    "category": "code",
    "dependencies": [
      "ansi-to-react",
      "lucide-react"
    ],
    "description": "Renders streamed console output with ANSI colors.",
    "name": "Terminal",
    "registryDependencies": [
      "button"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/terminal.json",
    "slug": "terminal"
  },
  {
    "category": "code",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Reports test suites, outcomes, and failure details.",
    "name": "Test Results",
    "registryDependencies": [
      "badge",
      "collapsible"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/test-results.json",
    "slug": "test-results"
  },
  {
    "category": "chatbot",
    "dependencies": [
      "ai",
      "lucide-react"
    ],
    "description": "Shows tool input, execution state, and output.",
    "name": "Tool",
    "registryDependencies": [
      "badge",
      "collapsible",
      "https://elements.ai-sdk.dev/api/registry/code-block.json"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/tool.json",
    "slug": "tool"
  },
  {
    "category": "workflow",
    "dependencies": [
      "@xyflow/react"
    ],
    "description": "Positions actions around a React Flow node.",
    "name": "Toolbar",
    "registryDependencies": [],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/toolbar.json",
    "slug": "toolbar"
  },
  {
    "category": "voice",
    "dependencies": [
      "@radix-ui/react-use-controllable-state",
      "ai"
    ],
    "description": "Synchronizes transcript segments with audio seeking.",
    "name": "Transcription",
    "registryDependencies": [],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/transcription.json",
    "slug": "transcription"
  },
  {
    "category": "voice",
    "dependencies": [
      "@radix-ui/react-use-controllable-state",
      "lucide-react"
    ],
    "description": "Searches and selects an AI voice in a dialog.",
    "name": "Voice Selector",
    "registryDependencies": [
      "button",
      "command",
      "dialog",
      "spinner"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/voice-selector.json",
    "slug": "voice-selector"
  },
  {
    "category": "code",
    "dependencies": [
      "lucide-react"
    ],
    "description": "Previews generated web output beside its source code.",
    "name": "Web Preview",
    "registryDependencies": [
      "button",
      "collapsible",
      "input",
      "tooltip"
    ],
    "registryUrl": "https://elements.ai-sdk.dev/api/registry/web-preview.json",
    "slug": "web-preview"
  }
] as const satisfies readonly AIElementMetadata[];

export type AIElementSlug = (typeof AI_ELEMENTS)[number]["slug"];

export function getAIElement(slug: string) {
  return AI_ELEMENTS.find((element) => element.slug === slug);
}
