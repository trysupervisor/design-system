import { getSvgPath } from "figma-squircle";

const sharedSlots = ["button", "alert-dialog-action", "alert-dialog-cancel", "questionnaire-previous", "questionnaire-skip", "questionnaire-next", "questionnaire-submit", "pagination-link", "plan-trigger", "audio-player-play-button", "audio-player-seek-backward-button", "audio-player-seek-forward-button", "card", "alert", "badge", "input-group", "select-trigger", "tabs-list", "tabs-trigger", "toggle", "checkbox", "command", "dialog-content", "alert-dialog-content", "drawer-content", "sheet-content", "popover-content", "dropdown-menu-content", "dropdown-menu-sub-content", "context-menu-content", "context-menu-sub-content", "select-content", "hover-card-content", "tooltip-content", "combobox-content", "menubar-content", "menubar-sub-content", "navigation-menu-viewport", "navigation-menu-content", "attachment", "item", "empty", "chart-tooltip"];
export const ledgerSharedCornerSelector = [...sharedSlots.map((slot) => `[data-slot="${slot}"]:not([data-ledger-corner])`), "div.rounded-lg.border.bg-background", "div.rounded-xl.border.bg-background", "div.rounded-lg.border.bg-card", "div.rounded-xl.border.bg-card", ".recharts-tooltip-wrapper > div"].join(", ");

export function ledgerSharedCornerMask(width: number, height: number, radii: readonly number[], smoothing = 0.6) {
  if (![width, height, ...radii, smoothing].every(Number.isFinite) || width < 2 || height < 2 || radii.length !== 4 || radii.every((radius) => radius <= 0)) return "";
  const [topLeftCornerRadius, topRightCornerRadius, bottomRightCornerRadius, bottomLeftCornerRadius] = radii.map((radius) => Math.max(0, Math.min(radius, width / 2, height / 2)));
  const path = getSvgPath({ width, height, topLeftCornerRadius, topRightCornerRadius, bottomRightCornerRadius, bottomLeftCornerRadius, cornerSmoothing: Math.max(0, Math.min(1, smoothing)), preserveSmoothing: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><path fill="black" d="${path}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const runtimes = new WeakMap<Document, { add: (scope: HTMLElement) => () => void }>();
const markers = new WeakMap<HTMLElement, { previous: string | null; count: number; marked: boolean }>();

export function ledgerPortalTarget(target: Element | null): HTMLElement | undefined {
  for (let node = target; node; node = node.parentElement) {
    const slot = node.getAttribute("data-slot");
    if (slot?.endsWith("-content") || slot?.endsWith("-overlay") || node.hasAttribute("data-sonner-toaster")) return node as HTMLElement;
  }
}

export function ledgerThemeOwner(element: Element, scopes: Iterable<HTMLElement>, portals: ReadonlyMap<HTMLElement, HTMLElement>): HTMLElement | undefined {
  for (let node: Element | null = element; node; node = node.parentElement) {
    const recipe = node.getAttribute("data-theme-recipe");
    const ledger = node.hasAttribute("data-ledger-theme");
    if (recipe !== null || ledger) {
      if (!ledger && recipe !== "ledger") return;
      for (const scope of scopes) if (scope === node || scope.contains(node)) return node as HTMLElement;
      return;
    }
    const portalOwner = portals.get(node as HTMLElement);
    if (portalOwner) return portalOwner;
  }
}

function createRuntime(document: Document) {
  const scopes = new Map<HTMLElement, number>();
  const observed = new Set<HTMLElement>();
  const geometry = new WeakMap<HTMLElement, string>();
  const portals = new Map<HTMLElement, HTMLElement>();
  const portalProperties = new Map<HTMLElement, Map<string, string>>();
  const nativeCorners = document.defaultView?.CSS?.supports("corner-shape", "superellipse(1.6)") ?? false;
  let frame = 0;
  const view = document.defaultView!;
  const owner = (element: Element) => ledgerThemeOwner(element, scopes.keys(), portals);
  const release = (element: HTMLElement) => {
    observed.delete(element);
    resize.unobserve(element);
    geometry.delete(element);
    element.style.removeProperty("--ledger-shared-corner-mask");
    delete element.dataset.ledgerSharedCorners;
    delete element.dataset.ledgerSharedPosition;
  };
  const update = (element: HTMLElement) => {
    if (!owner(element) || !element.isConnected) { release(element); return; }
    const style = view.getComputedStyle(element);
    const radii = [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius].map((value) => Number.parseFloat(value));
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const smoothing = Number.parseFloat(style.getPropertyValue("--ledger-corner-smoothing")) || 0.6;
    const key = `${width}:${height}:${radii.join(":")}:${smoothing}`;
    if (geometry.get(element) === key) return;
    geometry.set(element, key);
    const mask = ledgerSharedCornerMask(width, height, radii, smoothing);
    if (!mask) {
      element.style.removeProperty("--ledger-shared-corner-mask");
      delete element.dataset.ledgerSharedCorners;
      delete element.dataset.ledgerSharedPosition;
      return;
    }
    if (style.position === "static") element.dataset.ledgerSharedPosition = "relative";
    element.style.setProperty("--ledger-shared-corner-mask", mask);
    element.dataset.ledgerSharedCorners = "";
  };
  const resize = new ResizeObserver((entries) => entries.forEach(({ target }) => update(target as HTMLElement)));
  const releasePortal = (portal: HTMLElement) => {
    const saved = portalProperties.get(portal);
    saved?.forEach((value, name) => value ? portal.style.setProperty(name, value) : portal.style.removeProperty(name));
    portalProperties.delete(portal);
    portals.delete(portal);
    delete portal.dataset.ledgerPortal;
  };
  const syncPortal = (portal: HTMLElement, scope: HTMLElement) => {
    if (scope.contains(portal)) return;
    portals.set(portal, scope);
    portal.dataset.ledgerPortal = "";
    const style = view.getComputedStyle(scope);
    const saved = portalProperties.get(portal) ?? new Map<string, string>();
    for (const name of [...Array.from(style), "color-scheme"]) {
      if (name !== "color-scheme" && !/^--(?:ledger-(?!.*mask)|color-|background$|foreground$|card|popover|primary|secondary|muted|accent|destructive|border$|input$|ring$|chart-|sidebar|app-font$|heading-font$|button-font$|font-|radius$|control-height$)/.test(name)) continue;
      if (!saved.has(name)) saved.set(name, portal.style.getPropertyValue(name));
      const value = style.getPropertyValue(name);
      if (portal.style.getPropertyValue(name) !== value) portal.style.setProperty(name, value);
    }
    portalProperties.set(portal, saved);
  };
  const scan = () => {
    frame = 0;
    for (const [portal, scope] of portals) {
      if (!portal.isConnected || !owner(scope)) releasePortal(portal);
      else syncPortal(portal, scope);
    }
    for (const trigger of document.querySelectorAll<HTMLElement>("[aria-controls], [aria-describedby]")) {
      const scope = owner(trigger);
      if (!scope) continue;
      const ids = `${trigger.getAttribute("aria-controls") ?? ""} ${trigger.getAttribute("aria-describedby") ?? ""}`.trim().split(/\s+/);
      for (const id of ids) {
        const target = document.getElementById(id);
        const portal = ledgerPortalTarget(target);
        if (!portal || scope.contains(portal)) continue;
        syncPortal(portal, scope);
        const overlay = portal.previousElementSibling;
        if (overlay instanceof HTMLElement && overlay.matches('[data-slot$="-overlay"]')) syncPortal(overlay, scope);
      }
    }
    for (const family of ["context-menu", "hover-card"]) {
      const triggers = document.querySelectorAll<HTMLElement>(`[data-slot="${family}-trigger"][data-state="open"]`);
      const contents = document.querySelectorAll<HTMLElement>(`[data-slot="${family}-content"][data-state="open"]`);
      if (triggers.length !== 1 || contents.length !== 1) continue;
      const scope = owner(triggers[0]);
      if (scope && owner(contents[0]) !== scope) syncPortal(contents[0], scope);
    }
    if (nativeCorners) return;
    for (const element of observed) update(element);
    for (const element of document.querySelectorAll<HTMLElement>(ledgerSharedCornerSelector)) {
      if (observed.has(element) || !owner(element)) continue;
      observed.add(element);
      resize.observe(element);
      update(element);
    }
  };
  const schedule = () => { if (!frame) frame = view.requestAnimationFrame(scan); };
  const parser = document.createElement("div").style;
  const styleKey = (text: string) => {
    parser.cssText = text;
    return Array.from(parser).filter((name) => !/^(?:--ledger-(?:shared-)?corner-mask|transform|transform-origin|translate|rotate|scale|opacity|will-change)$/.test(name)).map((name) => name + ":" + parser.getPropertyValue(name) + parser.getPropertyPriority(name)).sort().join(";");
  };
  const mutations = new MutationObserver((records) => {
    if (records.some((record) => {
      if (record.type !== "attributes" || record.attributeName !== "style") return true;
      const element = record.target as HTMLElement;
      const before = styleKey(record.oldValue ?? "");
      const after = styleKey(element.getAttribute("style") ?? "");
      return before !== after;
    })) schedule();
  });
  mutations.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeOldValue: true, attributeFilter: ["class", "style", "data-theme-recipe", "data-ledger-theme", "data-state", "data-variant", "data-size", "data-side", "data-vaul-drawer-direction", "aria-controls", "aria-describedby"] });
  return {
    add(scope: HTMLElement) {
      scopes.set(scope, (scopes.get(scope) ?? 0) + 1);
      scan();
      return () => {
        const count = scopes.get(scope) ?? 0;
        if (count > 1) scopes.set(scope, count - 1);
        else scopes.delete(scope);
        if (scopes.size) { schedule(); return; }
        mutations.disconnect();
        resize.disconnect();
        if (frame) view.cancelAnimationFrame(frame);
        for (const element of observed) release(element);
        for (const portal of portals.keys()) releasePortal(portal);
        runtimes.delete(document);
      };
    },
  };
}

export function mountLedgerTheme(scope: HTMLElement) {
  const document = scope.ownerDocument;
  let runtime = runtimes.get(document);
  if (!runtime) { runtime = createRuntime(document); runtimes.set(document, runtime); }
  let marker = markers.get(scope);
  if (!marker) {
    const previous = scope.getAttribute("data-theme-recipe");
    marker = { previous, count: 0, marked: !scope.hasAttribute("data-ledger-theme") && previous !== "ledger" };
    markers.set(scope, marker);
  }
  marker.count += 1;
  if (marker.marked) scope.dataset.themeRecipe = "ledger";
  const cleanup = runtime.add(scope);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    cleanup();
    marker.count -= 1;
    if (marker.count) return;
    markers.delete(scope);
    if (marker.marked && scope.dataset.themeRecipe === "ledger") {
      if (marker.previous === null) scope.removeAttribute("data-theme-recipe");
      else scope.dataset.themeRecipe = marker.previous;
    }
  };
}
