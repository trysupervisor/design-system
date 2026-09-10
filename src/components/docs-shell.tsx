"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowTopRightIcon, CheckIcon, Component1Icon, GitHubLogoIcon, HamburgerMenuIcon, MagnifyingGlassIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/components/theme-provider";
import { COMPONENTS } from "@/lib/component-catalog";

const pages = [
  { name: "Introduction", href: "/" },
  { name: "Installation", href: "/installation" },
  { name: "Foundations", href: "/foundations" },
  { name: "Themes", href: "/themes" },
  { name: "Charts", href: "/charts" },
  { name: "All components", href: "/components" },
];

export function DocsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, resolvedMode, setMode } = useTheme();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(open => !open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  function navigate(href: string) { setSearchOpen(false); setMobileOpen(false); router.push(href); }
  const matching = COMPONENTS.filter(component => `${component.name} ${component.description}`.toLowerCase().includes(query.toLowerCase()));
  const sidebar = <>
    <div className="px-4 pt-5 pb-3"><div className="relative"><MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9 text-xs" aria-label="Filter components" placeholder="Filter components..." value={query} onChange={event => setQuery(event.target.value)} /></div></div>
    <nav className="docs-navigation" aria-label="Documentation">
      <div className="nav-group-label">Get started</div>
      {pages.map(page => <Link key={page.href} href={page.href} onClick={() => setMobileOpen(false)} aria-current={pathname === page.href ? "page" : undefined} className="docs-nav-link"><span>{page.name}</span>{page.href === "/themes" && <span className="nav-dot" />}{page.href === "/charts" && <span className="nav-small">6</span>}</Link>)}
      <div className="nav-group-label mt-7">Components <span className="ml-auto font-mono text-[10px]">{COMPONENTS.length}</span></div>
      {matching.map(component => <Link key={component.slug} href={`/components/${component.slug}`} onClick={() => setMobileOpen(false)} aria-current={pathname === `/components/${component.slug}` ? "page" : undefined} className="docs-nav-link">{component.name}</Link>)}
      {!matching.length && <p className="px-3 py-6 text-xs text-muted-foreground">No matching components.</p>}
    </nav>
    <div className="sidebar-foot"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-foreground" />Built with shadcn/ui</span><span className="font-mono">v0.1</span></div>
  </>;
  return <div className="site-frame">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <header className="docs-header">
      <div className="header-brand"><Link href="/" aria-label="Supervisor Design System home"><Image src="/supervisor-logo.svg" width={130} height={28} className="dark:hidden" alt="Supervisor" priority /><Image src="/supervisor-logo-white.svg" width={130} height={28} className="hidden dark:block" alt="Supervisor" priority /></Link><span className="brand-divider" /><span className="text-xs font-medium">UI</span></div>
      <button aria-label="Search the design system" className="global-search" onClick={() => setSearchOpen(true)}><MagnifyingGlassIcon className="size-3.5" /><span>Search the system...</span><kbd>⌘ K</kbd></button>
      <div className="header-actions"><Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild><Link href="/themes"><span className="size-2.5 rounded-full bg-primary ring-1 ring-border ring-offset-2 ring-offset-background" />{theme.name}</Link></Button><span className="h-4 w-px bg-border" /><Button variant="ghost" size="icon-sm" aria-label={resolvedMode === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setMode(resolvedMode === "dark" ? "light" : "dark")}>{resolvedMode === "dark" ? <SunIcon /> : <MoonIcon />}</Button><Button variant="ghost" size="icon-sm" aria-label="View GitHub repository" asChild><a href="https://github.com/trysupervisor/design-system" target="_blank" rel="noreferrer"><GitHubLogoIcon /></a></Button><Sheet open={mobileOpen} onOpenChange={setMobileOpen}><SheetTrigger asChild><Button variant="ghost" size="icon-sm" className="mobile-nav-button" aria-label="Open navigation"><HamburgerMenuIcon /></Button></SheetTrigger><SheetContent side="left" className="mobile-docs-sidebar"><SheetTitle className="sr-only">Documentation navigation</SheetTitle><SheetDescription className="sr-only">Browse foundations, themes, and components.</SheetDescription>{sidebar}</SheetContent></Sheet></div>
    </header>
    <aside className="docs-sidebar">{sidebar}</aside>
    <div className="docs-main"><main id="main-content" className={`docs-content ${pathname === "/themes" ? "docs-content-wide" : ""}`}>{children}</main><footer className="docs-footer"><span>Supervisor Design System</span><div className="flex items-center gap-5"><Link href="/installation">Start building <ArrowTopRightIcon className="inline size-3" /></Link><Link href="/themes">Make it yours <Component1Icon className="inline size-3" /></Link></div></footer></div>
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen} title="Search the design system" description="Find a component, theme, or guide."><Command><CommandInput aria-label="Search the design system" placeholder="Search components and pages..." /><CommandList><CommandEmpty>No matching results.</CommandEmpty><CommandGroup heading="Pages">{pages.map(page => <CommandItem key={page.href} onSelect={() => navigate(page.href)}>{page.name}</CommandItem>)}</CommandGroup><CommandGroup heading="Components">{COMPONENTS.map(component => <CommandItem key={component.slug} onSelect={() => navigate(`/components/${component.slug}`)}>{component.name}{pathname === `/components/${component.slug}` && <CheckIcon className="ml-auto" />}</CommandItem>)}</CommandGroup></CommandList></Command></CommandDialog>
    <Toaster position="bottom-right" theme={resolvedMode} />
  </div>;
}
