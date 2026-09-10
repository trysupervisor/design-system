import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentDocs } from "@/components/component-docs";
import { COMPONENTS, getComponent } from "@/lib/component-catalog";

export function generateStaticParams() {
  return COMPONENTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return {};
  return { title: component.name, description: component.description };
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getComponent(slug)) notFound();
  return <ComponentDocs slug={slug} />;
}
