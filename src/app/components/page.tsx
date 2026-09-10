import type { Metadata } from "next";
import { ComponentIndex } from "@/components/component-docs";

export const metadata: Metadata = {
  title: "Components",
  description: "Every reusable component in the Supervisor design system.",
};

export default function ComponentsPage() {
  return <ComponentIndex />;
}
