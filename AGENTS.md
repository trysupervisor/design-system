# Design system

Use Bun for installs, scripts, builds, and tests. The integration branch is main. Feature branches use type/description names. Keep library code independent from preview pages.

Use shadcn components under src/components/ui and original theme definitions. Do not copy stylesheets, icons, logos, or implementation code from proprietary design systems. Preserve third party license notices. Supervisor logo assets are owned by this organization.

Read relevant bundled Next.js documentation before changing framework behavior. Run lint, type checks, tests, registry generation, and the production build before publishing. Theme imports and generated output are untrusted data and must pass the shared schema.
