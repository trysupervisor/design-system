"use client";

import { getSvgPath } from "figma-squircle";
import { AnimatePresence, MotionConfig, motion, useIsPresent, useReducedMotion } from "motion/react";
import { useId, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { ledgerMotion, ledgerVariables } from "./ledger-tokens";
import "./ledger.css";

export { ledgerMotion, ledgerVariables } from "./ledger-tokens";

const ledgerDefaults = Object.fromEntries(Object.entries(ledgerVariables).map(([name, value]) => [name.replace("--ledger-", "--ledger-default-"), value]));

const cornerTargets = "[data-ledger-corner]";
const cornerOwners = new WeakMap<HTMLElement, symbol>();
const animatedStyleProperties = new Set(["transform", "transform-origin", "translate", "rotate", "scale", "opacity", "will-change", "--ledger-corner-mask"]);

export function ledgerCornerStyleKey(entries: readonly (readonly [string, string, string?])[]) {
  return entries.filter(([property]) => !animatedStyleProperties.has(property)).map(([property, value, priority]) => `${property}:${value}${priority ? `!${priority}` : ""}`).sort().join(";");
}

function useLedgerCorners(root: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const owner = Symbol("Ledger corners");
    const observed = new Set<HTMLElement>();
    const geometry = new WeakMap<HTMLElement, string>();
    const styleKeys = new WeakMap<Element, string>();
    const parser = document.createElement("div").style;
    const styleKey = (style: CSSStyleDeclaration) => ledgerCornerStyleKey(Array.from({ length: style.length }, (_, index) => {
      const property = style.item(index);
      return [property, style.getPropertyValue(property), style.getPropertyPriority(property)] as const;
    }));
    const owns = (element: HTMLElement) => scope.contains(element) && element.closest("[data-ledger-theme]") === scope && element.matches(cornerTargets);
    const update = (element: HTMLElement) => {
      if (!observed.has(element) || !owns(element)) return;
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      const style = getComputedStyle(element);
      const radius = Number.parseFloat(style.borderTopLeftRadius);
      const rawSmoothing = Number.parseFloat(style.getPropertyValue("--ledger-corner-smoothing") || style.getPropertyValue("--ledger-default-corner-smoothing"));
      const smoothing = Number.isFinite(rawSmoothing) ? Math.max(0, Math.min(1, rawSmoothing)) : 0.6;
      const key = `${width}:${height}:${radius}:${smoothing}`;
      if (geometry.get(element) === key) return;
      geometry.set(element, key);
      if (width < 2 || height < 2 || !Number.isFinite(radius) || radius <= 0) {
        element.style.removeProperty("--ledger-corner-mask");
        delete element.dataset.ledgerCorners;
        return;
      }
      const path = getSvgPath({ width, height, cornerRadius: Math.min(radius, width / 2, height / 2), cornerSmoothing: smoothing, preserveSmoothing: true });
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><path fill="black" d="${path}"/></svg>`;
      element.style.setProperty("--ledger-corner-mask", `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
      element.dataset.ledgerCorners = "true";
    };
    const resize = new ResizeObserver((entries) => entries.forEach(({ target }) => update(target as HTMLElement)));
    const release = (element: HTMLElement) => {
      if (!observed.delete(element)) return;
      resize.unobserve(element);
      geometry.delete(element);
      styleKeys.delete(element);
      if (cornerOwners.get(element) === owner) {
        cornerOwners.delete(element);
        element.style.removeProperty("--ledger-corner-mask");
        delete element.dataset.ledgerCorners;
      }
    };
    const observe = (element: Element) => {
      if (!(element instanceof HTMLElement) || !owns(element)) return;
      if (cornerOwners.get(element) !== owner) {
        cornerOwners.set(element, owner);
        geometry.delete(element);
      }
      if (!observed.has(element)) {
        observed.add(element);
        styleKeys.set(element, styleKey(element.style));
        resize.observe(element);
      }
      update(element);
    };
    const scanAdded = (node: Element) => {
      observe(node);
      node.querySelectorAll(cornerTargets).forEach(observe);
    };
    const refreshTree = (node: Element) => {
      for (const element of observed) {
        if (node === element || node.contains(element)) {
          if (owns(element)) update(element);
          else release(element);
        }
      }
    };
    scanAdded(scope);
    const mutations = new MutationObserver((records) => {
      const refresh = new Set<Element>();
      for (const record of records) {
        if (record.type === "childList") {
          for (const node of record.removedNodes) {
            if (!(node instanceof Element)) continue;
            for (const element of observed) {
              if ((node === element || node.contains(element)) && !owns(element)) release(element);
            }
          }
          for (const node of record.addedNodes) if (node instanceof Element) scanAdded(node);
          continue;
        }
        const target = record.target;
        if (!(target instanceof HTMLElement)) continue;
        if (record.attributeName === "style") {
          const next = styleKey(target.style);
          let previous = styleKeys.get(target);
          if (previous === undefined) {
            parser.cssText = record.oldValue ?? "";
            previous = styleKey(parser);
          }
          styleKeys.set(target, next);
          if (previous === next) continue;
        }
        if (record.attributeName === "data-ledger-corner" || record.attributeName === "data-ledger-theme") scanAdded(target);
        refresh.add(target);
      }
      for (const node of refresh) refreshTree(node);
    });
    mutations.observe(scope, { childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ["class", "style", "data-ledger-corner", "data-ledger-radius", "data-ledger-theme"] });
    return () => {
      mutations.disconnect();
      resize.disconnect();
      for (const element of observed) release(element);
    };
  }, [root]);
}

export function LedgerProvider({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const root = useRef<HTMLDivElement>(null);
  useLedgerCorners(root);
  return <MotionConfig reducedMotion="user"><div ref={root} data-ledger-theme="" className={className} style={{ ...ledgerDefaults, ...style } as CSSProperties}>{children}</div></MotionConfig>;
}

export function LedgerSurface({ tone = "paper", radius = "panel", elevation = "none", className, ...props }: ComponentProps<"div"> & { tone?: "canvas" | "paper" | "ink" | "muted"; radius?: "shell" | "panel" | "card" | "control"; elevation?: "none" | "panel" | "floating" }) {
  return <div data-slot="card" data-ledger-corner="" data-ledger-tone={tone} data-ledger-radius={radius} data-ledger-elevation={elevation} className={["ledger-surface", className].filter(Boolean).join(" ")} {...props} />;
}

export function LedgerButton({ variant = "ghost", className, type = "button", ...props }: ComponentProps<"button"> & { variant?: "primary" | "ghost" }) {
  return <button data-slot="button" data-ledger-corner="" data-ledger-variant={variant} type={type} className={["ledger-button", className].filter(Boolean).join(" ")} {...props} />;
}

export function LedgerTable({ className, ...props }: ComponentProps<"table">) {
  return <div className="ledger-table-scroll" data-slot="ledger-table-scroll" tabIndex={0} role="region" aria-label={props["aria-label"] ? `${props["aria-label"]} table` : "Scrollable table"}><div className="ledger-table-mask" data-slot="table-container" data-ledger-corner=""><table data-slot="table" className={["ledger-table", className].filter(Boolean).join(" ")} {...props} /></div></div>;
}

function SearchIcon({ close = false }: { close?: boolean }) {
  return <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">{close ? <path d="m4 4 8 8M12 4l-8 8" /> : <><circle cx="6.8" cy="6.8" r="4.5" /><path d="m10.2 10.2 3.5 3.5" /></>}</svg>;
}

function SearchField({ value, onValueChange, close, label, placeholder }: { value: string; onValueChange: (value: string) => void; close: () => void; label: string; placeholder: string }) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  return <motion.div data-slot="ledger-search-field" data-ledger-corner="" className="ledger-search-field" inert={!present} aria-hidden={!present} initial={{ opacity: 0, x: reduced ? 0 : 5, scale: reduced ? 1 : 0.975 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: reduced ? 0 : 5, scale: reduced ? 1 : 0.975, transition: reduced ? { duration: 0 } : ledgerMotion.exit }} transition={reduced ? { duration: 0 } : ledgerMotion.enter} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(); } }}>
    <SearchIcon /><input autoFocus aria-label={label} placeholder={placeholder} value={value} onChange={(event) => onValueChange(event.target.value)} /><LedgerButton className="ledger-search-close" aria-label="Close search" onClick={close}><SearchIcon close /></LedgerButton>
  </motion.div>;
}

function SearchSummary({ children, restoreFocus, open, label }: { children: ReactNode; restoreFocus: boolean; open: () => void; label: string }) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  return <motion.div className="ledger-search-idle" inert={!present} aria-hidden={!present} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={reduced ? { duration: 0 } : ledgerMotion.summary}><span>{children}</span><LedgerButton autoFocus={restoreFocus} aria-label={label} aria-expanded={false} onClick={open}><SearchIcon /></LedgerButton></motion.div>;
}

export function LedgerSearch({ value, onValueChange, placeholder = "Search", label = "Search", summary }: { value: string; onValueChange: (value: string) => void; placeholder?: string; label?: string; summary?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const close = () => { setOpen(false); onValueChange(""); };
  return <div className="ledger-search" data-slot="ledger-search"><AnimatePresence initial={false} mode="wait">{open ? <SearchField key="field" value={value} onValueChange={onValueChange} close={close} label={label} placeholder={placeholder} /> : <SearchSummary key="summary" restoreFocus={hasOpened} label={label} open={() => { setHasOpened(true); setOpen(true); }}>{summary}</SearchSummary>}</AnimatePresence></div>;
}

function PresenceContent({ children, className }: { children: ReactNode; className?: string }) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  return <motion.div className={className} data-slot="ledger-presence" inert={!present} aria-hidden={!present} layout={!reduced} initial={{ opacity: 0, x: reduced ? 0 : 5, scale: reduced ? 1 : 0.975 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: reduced ? 0 : 5, scale: reduced ? 1 : 0.975, transition: reduced ? { duration: 0 } : ledgerMotion.exit }} transition={{ ...(reduced ? { duration: 0 } : ledgerMotion.enter), layout: reduced ? { duration: 0 } : ledgerMotion.layout }}>{children}</motion.div>;
}

export function LedgerPresence({ show, children, className }: { show: boolean; children: ReactNode; className?: string }) {
  return <AnimatePresence initial={false}>{show && <PresenceContent key="content" className={className}>{children}</PresenceContent>}</AnimatePresence>;
}

export function LedgerRangeSelector({ value, options, onValueChange }: { value: string; options: readonly string[]; onValueChange: (value: string) => void }) {
  const id = useId();
  const reduced = useReducedMotion();
  return <div className="ledger-range" role="group" aria-label="Chart range">{Array.from(new Set(options)).map((option) => <button type="button" data-ledger-corner="" key={option} aria-pressed={option === value} onClick={() => onValueChange(option)}>{option === value && <motion.span className="ledger-range-selection" data-ledger-corner="" layoutId={`ledger-range-${id}`} transition={reduced ? { duration: 0 } : ledgerMotion.layout} />}<span>{option}</span></button>)}</div>;
}
