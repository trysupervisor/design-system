import type { Metadata } from "next";
import { ChartGallery } from "@/components/chart-gallery";
import { Badge } from "@/components/ui/badge";
import { CHART_COUNT } from "@/lib/chart-metadata";
import { CopyCommand } from "@/components/overview";

export const metadata: Metadata = {
  title: "Charts",
  description: "Charts from the Supervisor widget library, with theme styling, range controls, and accessible data.",
};

export default function ChartsPage() {
  return (
    <div>
      <header className="page-intro">
        <Badge variant="outline">{CHART_COUNT} chart types</Badge>
        <h1>Charts</h1>
        <p>Trends, comparisons, distributions, targets, and relationships from the Supervisor widget library. Every chart follows your theme, animates range changes, and includes inspectable values and a data table.</p>
      </header>
      <div className="mb-8"><CopyCommand command="bunx shadcn@latest add https://ui.trysupervisor.com/r/supervisor-charts.json" /></div>
      <ChartGallery />
    </div>
  );
}
