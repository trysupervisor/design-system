export type BrandThemeReference = {
  brand: string
  reference: string
  mode: "light" | "dark"
  typography: string
  geometry: string
  adaptation: string
  sources: { label: string; url: string }[]
}

const geistReference: BrandThemeReference = {
  brand: "Vercel",
  reference: "Geist components and dashboard surfaces",
  mode: "light",
  typography: "Geist Sans is the actual interface family. Code keeps Geist Mono.",
  geometry: "The reference uses a 4 px spacing step, 36 px medium controls, and 6 px everyday corners. Larger menus use 12 px corners.",
  adaptation: "Hex colors use the published sRGB equivalents. The shared shadcn radius and flat resting surfaces simplify Geist material elevation.",
  sources: [
    { label: "Geist colors", url: "https://vercel.com/geist/colors" },
    { label: "Typography", url: "https://vercel.com/geist/typography" },
    { label: "Buttons", url: "https://vercel.com/geist/button" },
    { label: "Materials", url: "https://vercel.com/geist/materials" },
  ],
}

export const brandThemeReferences: Record<string, BrandThemeReference> = {
  "notion-paper": {
    brand: "Notion",
    reference: "Notion workspace and page appearance",
    mode: "light",
    typography: "System Sans follows the product chrome, with Inter as a free fallback. Notion's Serif and Mono options style page content separately.",
    geometry: "32 px controls, 6 px corners, flat panels, and a 4 px spacing step are our adaptation. Notion describes its spacing approach without publishing a complete numeric scale.",
    adaptation: "Warm paper surfaces, gray borders, and blue actions approximate the workspace. Light action blue is darkened and dark actions use black text to meet the theme contrast requirement.",
    sources: [
      { label: "Page design", url: "https://www.notion.com/en-gb/blog/updating-the-design-of-notion-pages" },
      { label: "Page typography", url: "https://www.notion.com/help/customize-and-style-your-content" },
      { label: "Appearance settings", url: "https://www.notion.com/en-gb/help/account-settings" },
    ],
  },
  "linear-purple": {
    brand: "Linear",
    reference: "Linear product UI and theme system",
    mode: "dark",
    typography: "Inter is Linear's actual interface family. This preset uses its free variable version for both body and headings.",
    geometry: "32 px controls, 6 px buttons, 8 px panels, a 4 px spacing step, and soft borders adapt Linear's compact interface.",
    adaptation: "The palette follows Linear's warmer neutrals, dim sidebar, and desaturated blue accent. Numeric colors and sizes are our approximation of the current UI, not the older Ash or Midnight example themes.",
    sources: [
      { label: "Interface refresh", url: "https://linear.app/now/behind-the-latest-design-refresh" },
      { label: "Typography and themes", url: "https://linear.app/now/how-we-redesigned-the-linear-ui" },
      { label: "Brand reference", url: "https://linear.app/brand" },
    ],
  },
  "github-ink": {
    brand: "GitHub",
    reference: "Current Primer light and default dark",
    mode: "light",
    typography: "Mona Sans is the first family in the current Primer stack. We use GitHub's freely available variable font.",
    geometry: "Primer specifies 32 px medium controls, 6 px standard corners, and a 4 px spacing step. The resting shadow is simplified to one subtle layer.",
    adaptation: "Functional colors follow Primer: green primary actions, blue focus, and the default #0D1117 dark canvas. Selected surfaces, chart companions, and shadow composition are adapted to shadcn.",
    sources: [
      { label: "Primer colors", url: "https://primer.style/product/primitives/color/" },
      { label: "Primer button", url: "https://primer.style/product/components/button/" },
      { label: "Sizing", url: "https://primer.style/product/primitives/size/" },
      { label: "Mona Sans", url: "https://github.com/github/mona-sans" },
    ],
  },
  "figma-coral": {
    brand: "Figma",
    reference: "Figma Design semantic tokens and UI3",
    mode: "light",
    typography: "Inter is Figma's actual interface font and is freely available. The preset uses its variable version.",
    geometry: "32 px controls, 6 px buttons, 8 px panels, and a 4 px spacing step adapt UI3's rounded panels and compact controls. These dimensions are not published Figma tokens.",
    adaptation: "Blue replaces the former logo coral. Surfaces follow Figma Design light and dark tokens. Primary labels use black, and secondary text is strengthened for contrast. Alpha colors are flattened to hex.",
    sources: [
      { label: "Figma color tokens", url: "https://developers.figma.com/docs/plugins/css-variables/" },
      { label: "Inter in Figma", url: "https://www.figma.com/blog/the-birth-of-inter/" },
      { label: "UI3 design", url: "https://www.figma.com/blog/behind-our-redesign-ui3/" },
    ],
  },
  geist: geistReference,
  "vercel-mono": { ...geistReference, reference: "Vercel product UI", mode: "dark" },
  supervisor: {
    brand: "Supervisor",
    reference: "Current Supervisor website",
    mode: "light",
    typography: "System Sans matches the current website body. Sk Modernist display headings and VCR labels are separate roles and are not bundled in this preset.",
    geometry: "44 px controls, 3 px ordinary corners, 5 px brand button corners, and a 4 px spacing step follow the website components.",
    adaptation: "Orange is promoted from the brand action variant to primary, with black text for contrast. Panels share the 3 px control radius. The layered brand shadow is simplified. The dark green chart color is brightened for visibility.",
    sources: [{ label: "Supervisor website", url: "https://trysupervisor.com" }],
  },
  "spotify-green": {
    brand: "Spotify",
    reference: "Spotify Web Player",
    mode: "dark",
    typography: "Spotify Mix is proprietary. DM Sans is our free substitute for its rounded interface letterforms.",
    geometry: "48 px controls, pill buttons with bold labels, 8 px panels, and a 4 px spacing step follow observed Web Player CSS.",
    adaptation: "The dark layers and bright green come from the player. Light mode and chart companions are adaptations. Translucent borders are flattened to hex colors, and card shadows stay off.",
    sources: [
      { label: "Spotify Mix", url: "https://newsroom.spotify.com/2024-05-22/introducing-spotify-mix-our-new-and-exclusive-font/" },
      { label: "Design guidance", url: "https://developer.spotify.com/documentation/design" },
      { label: "Web Player", url: "https://open.spotify.com" },
      { label: "Observed player styles", url: "https://open.spotifycdn.com/cdn/build/mobile-web-player/mobile-web-player.c995024c.css" },
    ],
  },
  "netflix-red": {
    brand: "Netflix",
    reference: "Netflix website and brand palette",
    mode: "dark",
    typography: "Netflix Sans is proprietary. Inter is our free substitute for its neutral interface typography.",
    geometry: "40 px controls, 4 px corners, restrained borders, and spacing in multiples of 4 px adapt the public website. Prominent website actions are larger.",
    adaptation: "Netflix Red is #E50914. Black surfaces and quiet gray layers follow the website. Light mode, chart grays, and opaque border equivalents are adaptations.",
    sources: [
      { label: "Netflix brand palette", url: "https://brand.netflix.com/en/assets/logos/" },
      { label: "Netflix website", url: "https://www.netflix.com" },
    ],
  },
  "apple-clean": {
    brand: "Apple",
    reference: "Apple website and system typography",
    mode: "light",
    typography: "System Sans uses the native device font, including San Francisco on Apple devices, with Inter as a free fallback. SF Pro files are not redistributed.",
    geometry: "Pill actions and 12 px panel corners follow Apple web treatments. Controls use a 44 px height and the shared 4 px spacing step.",
    adaptation: "Light neutrals and #0071E3 come from Apple web CSS. Dark mode, chart colors, and panel sizing are adaptations. Dark secondary text is brighter for readability.",
    sources: [
      { label: "Apple website", url: "https://www.apple.com" },
      { label: "Observed web styles", url: "https://www.apple.com/v/homepage/a/styles/main.built.css" },
      { label: "Typography guidance", url: "https://developer.apple.com/design/human-interface-guidelines/typography" },
      { label: "Color guidance", url: "https://developer.apple.com/design/human-interface-guidelines/color" },
    ],
  },
  "openai-forest": {
    brand: "OpenAI",
    reference: "OpenAI identity and ChatGPT appearance",
    mode: "light",
    typography: "OpenAI Sans is proprietary. Manrope is our free substitute for the geometric, rounded construction described in the brand guide.",
    geometry: "40 px controls, pill buttons, 12 px panels, and a 4 px spacing step are our adaptation of ChatGPT. OpenAI does not publish these dimensions as reusable tokens.",
    adaptation: "Neutral surfaces replace the former forest green palette. The numeric palette, chart grays, and geometry are visual approximations, not official OpenAI tokens.",
    sources: [
      { label: "OpenAI brand guide", url: "https://openai.com/brand/" },
      { label: "ChatGPT", url: "https://chatgpt.com" },
    ],
  },
}
