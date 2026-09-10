import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DocsShell } from "@/components/docs-shell";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ui.trysupervisor.com"),
  title: { default: "Supervisor Design System", template: "%s | Supervisor UI" },
  description: "A shadcn design system with adaptable themes, interactive components, charts, and a theme studio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}><head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head><body><ThemeProvider><TooltipProvider><DocsShell>{children}</DocsShell></TooltipProvider></ThemeProvider></body></html>;
}
