// Modified for Supervisor compatibility. License: Apache 2.0.
"use client";

import { HoverCard } from "@/components/ui/hover-card";
import type { ComponentProps } from "react";

export type TimedHoverCardProps = Omit<ComponentProps<typeof HoverCard>, "openDelay" | "closeDelay"> & {
  openDelay?: number;
  closeDelay?: number;
};

export function TimedHoverCard({ openDelay = 0, closeDelay = 0, ...props }: TimedHoverCardProps) {
  // Radix reads root delays. Base UI retains its native trigger timing.
  const nativeProps = { ...props, openDelay, closeDelay };
  return <HoverCard {...nativeProps} />;
}
