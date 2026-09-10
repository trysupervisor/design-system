# Design system

Use Bun for installs, scripts, builds, and tests. The integration branch is main. Feature branches use type/description names. Keep library code independent from preview pages.

Use shadcn components under src/components/ui and original theme definitions. Do not copy stylesheets, icons, logos, or implementation code from proprietary design systems. Preserve third party license notices. Supervisor logo assets are owned by this organization.

Read relevant bundled Next.js documentation before changing framework behavior. Run lint, type checks, tests, registry generation, and the production build before publishing. Theme imports and generated output are untrusted data and must pass the shared schema.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
