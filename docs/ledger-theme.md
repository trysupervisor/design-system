# Ledger theme

Ledger is a compact interface kit for tables, selection, search, charts, and detail panels. It uses a pale canvas, white paper, charcoal ink, and one red marker.

## Installation

Run this command in a Next.js app with shadcn configured.

```sh
bunx shadcn@latest add https://ui.trysupervisor.com/r/theme-ledger.json
```

The registry item installs the Ledger palette, provider, components, chart, tokens, and styles together.

The installer follows the aliases in `components.json`. The examples use the standard `@/components/ui` path. Change those imports if the app uses another UI alias.

## Provider and page

Import the provider in the page or layout that owns the Ledger interface. The provider scopes the tokens and continuous corner handling to its descendants.

```tsx
import { LedgerProvider } from "@/components/ui/ledger"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LedgerProvider>{children}</LedgerProvider>
}
```

Use `LedgerSurface`, `LedgerSearch`, `LedgerTable`, `LedgerRangeSelector`, `LedgerChart`, `LedgerPresence`, and `LedgerButton` inside that boundary. The complete copyable page lives in the [Ledger guide](https://ui.trysupervisor.com/themes/ledger).

## Visual rules

Four colors carry the interface. Pale gray is the canvas, white is paper, charcoal is ink, and red marks the current chart endpoint or another item that needs attention.

Spacing follows shell, panel, control, and inset roles. Radius roles use continuous corners with smoothing set to 0.6. Layered shadows sit outside the surface fill mask so rounded edges do not clip them.

Text uses the native San Francisco family on Apple devices. System fallbacks cover other platforms. Tabular data uses the installed monospace stack.

## Behavior

The chart morphs when its range changes. Pointer, touch, Left Arrow, Right Arrow, Home, End, and Escape controls inspect points. Reduced motion removes spatial movement and shortens transitions.

Closing search clears its value and returns focus to the trigger. Escape works from the field and its close control. The exit animation keeps the field mounted, inert, and padded until the transition finishes.

Detail panels use the same enter and exit timing. Content becomes inert while it leaves.

## Exports and portalled content

Copy CSS and Export JSON in Theme Studio save the editable palette, type choice, spacing, radius, border, and shadow values. They do not include the Ledger components or chart behavior. Use the registry command when the app needs the full kit.

Ledger scopes its behavior to `LedgerProvider`. Wrap each separately portalled menu, dialog, or tooltip in another provider so it receives the same tokens and continuous corner handling.

The included demo data is deterministic and illustrative. A consuming app must supply its own data source, formatting, loading state, and error state.
