"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AI_ELEMENTS } from "@/lib/ai-elements-catalog";

export function AIElementsIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => [...new Set(AI_ELEMENTS.map((item) => item.category))], []);
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return AI_ELEMENTS.filter((item) => {
      const inCategory = category === "All" || item.category === category;
      const hasText = !normalized || `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(normalized);
      return inCategory && hasText;
    });
  }, [category, query]);

  return (
    <div className="catalog-page">
      <header className="page-intro">
        <Badge variant="outline">{AI_ELEMENTS.length} AI Elements</Badge>
        <h1>AI Elements</h1>
        <p>Build chat, agent, code, workflow, media, and voice interfaces with the complete installable Vercel AI Elements catalog.</p>
      </header>

      <div className="mb-8 flex flex-col gap-4 border-y py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">AI Elements targets React 19 and Tailwind CSS 4. The Supervisor registry is verified with Base Nova and Radix Nova shadcn apps.</p>
        <Button asChild size="sm" variant="outline">
          <Link href="https://ai-sdk.dev/elements" target="_blank" rel="noreferrer">Official documentation <ArrowRightIcon /></Link>
        </Button>
      </div>

      <div className="catalog-controls">
        <div className="catalog-search">
          <SearchIcon aria-hidden="true" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search AI Elements" placeholder="Search AI Elements" />
        </div>
        <div className="catalog-filters" aria-label="Filter AI Elements by category">
          {["All", ...categories].map((item) => (
            <Button key={item} size="sm" variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)}>{item}</Button>
          ))}
        </div>
      </div>

      {matches.length ? (
        <div className="component-index-grid">
          {matches.map((item) => (
            <Link key={item.slug} href={`/ai-elements/${item.slug}`} className="component-index-item">
              <span className="component-index-meta"><span>{item.category}</span><ArrowRightIcon aria-hidden="true" /></span>
              <strong>{item.name}</strong>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="catalog-empty" role="status">
          <p>No AI Elements match this search.</p>
          <Button variant="outline" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</Button>
        </div>
      )}

      <section className="mt-12 border-t pt-8">
        <h2 className="text-lg font-semibold tracking-tight">Install the complete catalog</h2>
        <p className="mt-2 text-sm text-muted-foreground">Add every AI Element through the Supervisor registry.</p>
        <pre className="install-command mt-5"><code>bunx shadcn@latest add https://ui.trysupervisor.com/r/ai-elements.json</code></pre>
      </section>
    </div>
  );
}
