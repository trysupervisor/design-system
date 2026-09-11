"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import "./supervisor-brand-button.css";

export type SupervisorBrandButtonProps = ComponentProps<typeof Button>;

export function SupervisorBrandButton(props: SupervisorBrandButtonProps) {
  return <Button {...props} data-supervisor-brand="" data-supervisor-brand-size={props.size ?? "default"} />;
}
