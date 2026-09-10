import type { Metadata } from "next";
import { ChartGallery } from "@/components/chart-gallery";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Charts",
  description: "Responsive shadcn chart examples built with Recharts.",
};

export default function ChartsPage() {
  return (
    <div>
      <header className="page-intro">
        <Badge variant="outline">6 chart types</Badge>
        <h1>Charts</h1>
        <p>Responsive examples built with Recharts and the shadcn chart helpers. Every chart uses the active theme tokens.</p>
      </header>
      <ChartGallery />
    </div>
  );
}
