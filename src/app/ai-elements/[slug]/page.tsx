import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AIElementDocs } from "@/components/ai-element-docs";
import { AI_ELEMENTS } from "@/lib/ai-elements-catalog";

export function generateStaticParams() {
  return AI_ELEMENTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = AI_ELEMENTS.find((entry) => entry.slug === slug);
  return item ? { title: item.name, description: item.description } : {};
}

export default async function AIElementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!AI_ELEMENTS.some((item) => item.slug === slug)) notFound();
  return <AIElementDocs slug={slug} />;
}
