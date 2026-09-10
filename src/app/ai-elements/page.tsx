import type { Metadata } from "next";
import { AIElementsIndex } from "@/components/ai-elements-index";

export const metadata: Metadata = {
  title: "AI Elements",
  description: "The complete installable Vercel AI Elements catalog with interactive examples.",
};

export default function AIElementsPage() {
  return <AIElementsIndex />;
}
