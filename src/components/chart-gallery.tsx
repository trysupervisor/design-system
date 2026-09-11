"use client";

import { CodeDisclosure } from "@/components/code-disclosure";
import { CHART_CATALOG } from "@/lib/chart-catalog";

export function ChartGallery() {
  return (
    <div className="chart-gallery">
      {CHART_CATALOG.map((chart) => {
        const Chart = chart.component;
        return (
          <section className="component-example chart-example" key={chart.slug} data-chart-family={chart.slug}>
            <header className="component-example-header">
              <span className="chart-category">{chart.category}</span>
              <h2>{chart.name}</h2>
              <p>{chart.description}</p>
            </header>
            <div className="chart-preview">
              <Chart />
            </div>
            <CodeDisclosure title={chart.name} code={chart.source} />
          </section>
        );
      })}
    </div>
  );
}
