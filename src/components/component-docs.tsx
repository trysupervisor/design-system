"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "lucide-react";
import { CodeDisclosure } from "@/components/code-disclosure";
import { ComponentExample } from "@/components/examples/component-example";
import { COMPONENT_SNIPPETS } from "@/components/examples/component-snippets";
import { SupervisorBrandButtonExample } from "@/components/examples/supervisor-brand-button-example";
import { DeviceDetails } from "@/components/examples/device-example";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { themeVariables } from "@/lib/theme";
import { defaultTheme } from "@/lib/theme-presets";
import { COMPONENTS, COMPONENT_CATEGORIES, getComponent } from "@/lib/component-catalog";

export function ComponentIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const matchingComponents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return COMPONENTS.filter((component) => {
      const matchesCategory = category === "All" || component.category === category;
      const matchesQuery = !normalizedQuery || `${component.name} ${component.description} ${component.category}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="catalog-page">
      <header className="page-intro">
        <Badge variant="outline">{COMPONENTS.length} components</Badge>
        <h1>Components</h1>
        <p>Browse the shadcn catalog and Supervisor additions. Each page has an interactive example, install command, and editable source.</p>
      </header>
      <div className="catalog-controls">
        <div className="catalog-search"><SearchIcon aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search components" placeholder="Search components" /></div>
        <div className="catalog-filters" aria-label="Filter by category">
          {["All", ...COMPONENT_CATEGORIES].map((item) => <Button key={item} size="sm" variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)}>{item}</Button>)}
        </div>
      </div>
      {matchingComponents.length ? (
        <div className="component-index-grid">
          {matchingComponents.map((component) => (
            <Link key={component.slug} href={`/components/${component.slug}`} className="component-index-item">
              <span className="component-index-meta"><span>{component.category}</span><ArrowRightIcon aria-hidden="true" /></span>
              <strong>{component.name}</strong>
              <p>{component.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="catalog-empty" role="status"><p>No components match this search.</p><Button variant="outline" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</Button></div>
      )}
    </div>
  );
}

export function ComponentDocs({ slug }: { slug: string }) {
  const { resolvedMode } = useTheme();
  const previewStyle = slug === "button" ? {
    ...themeVariables(defaultTheme, resolvedMode),
    fontFamily: "var(--app-font)",
    color: "var(--foreground)",
  } as CSSProperties : undefined;
  const component = getComponent(slug);
  if (!component) return null;
  const index = COMPONENTS.findIndex((item) => item.slug === slug);
  const previous = COMPONENTS[index - 1];
  const next = COMPONENTS[index + 1];
  const code = COMPONENT_SNIPPETS[slug];

  return (
    <article className="component-docs">
      <header className="page-intro component-docs-intro">
        <div className="component-docs-meta"><Badge variant="outline">{component.category}</Badge><span>{slug === "device" ? "Supervisor" : "shadcn/ui"}</span></div>
        <h1>{component.name}</h1>
        <p>{component.description}</p>
      </header>

      <section className="component-docs-section">
        <h2>Preview</h2>
        <div className="component-frame" style={previewStyle}>
          <div className="component-preview"><ComponentExample slug={slug} /></div>
          <CodeDisclosure title={component.name} code={code} />
        </div>
      </section>

      {slug === "button" ? <SupervisorBrandButtonExample /> : null}
      {slug === "device" ? <DeviceDetails /> : null}

      <section className="component-docs-section">
        <h2>Install</h2>
        <p>Run this command from a project configured for shadcn. The installer follows your component base and aliases.</p>
        {slug === "device" ? <p>Device works with either shadcn component base in a Next.js app. The install includes the component, its CSS, and editable frame settings.</p> : <p>Install the <Link href="/installation">Supervisor theme</Link> first to use these styles. Preview examples use Radix; Base UI apps keep their native component APIs.</p>}
        <pre className="install-command"><code>{`bunx shadcn@latest add https://ui.trysupervisor.com/r/${slug}.json`}</code></pre>
      </section>

      <nav className="component-pagination" aria-label="Component pages">
        {previous ? <Link href={`/components/${previous.slug}`}><ArrowLeftIcon /><span><small>Previous</small>{previous.name}</span></Link> : <span />}
        {next ? <Link href={`/components/${next.slug}`}><span><small>Next</small>{next.name}</span><ArrowRightIcon /></Link> : <span />}
      </nav>
    </article>
  );
}
