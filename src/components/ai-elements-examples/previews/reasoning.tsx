"use client";

import { useEffect, useState } from "react";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";

const reasoningText = "I will compare the request with the available project files. Then I will check each source claim and draft the smallest complete answer.";
const tokens = reasoningText.match(/.{1,4}/g) ?? [];

export default function ReasoningPreview() {
  const [content, setContent] = useState("");
  const [index, setIndex] = useState(0);
  const isStreaming = index < tokens.length;
  useEffect(() => {
    if (!isStreaming) return;
    const timer = window.setTimeout(() => {
      setContent((current) => current + tokens[index]);
      setIndex((current) => current + 1);
    }, 35);
    return () => window.clearTimeout(timer);
  }, [index, isStreaming]);
  return (
    <div className="mx-auto min-h-52 w-full max-w-xl p-4">
      <Reasoning className="w-full" isStreaming={isStreaming}>
        <ReasoningTrigger />
        <ReasoningContent>{content}</ReasoningContent>
      </Reasoning>
    </div>
  );
}
