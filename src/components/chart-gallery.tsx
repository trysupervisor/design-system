"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";
import { CodeDisclosure } from "@/components/code-disclosure";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const monthlyData = [
  { month: "Jan", desktop: 186, mobile: 92 },
  { month: "Feb", desktop: 242, mobile: 121 },
  { month: "Mar", desktop: 214, mobile: 156 },
  { month: "Apr", desktop: 289, mobile: 171 },
  { month: "May", desktop: 274, mobile: 198 },
  { month: "Jun", desktop: 318, mobile: 221 },
];

const mixData = [
  { channel: "Direct", visitors: 38, fill: "var(--color-direct)" },
  { channel: "Search", visitors: 29, fill: "var(--color-search)" },
  { channel: "Referral", visitors: 21, fill: "var(--color-referral)" },
  { channel: "Social", visitors: 12, fill: "var(--color-social)" },
];

const radarData = [
  { metric: "Speed", current: 82, previous: 67 },
  { metric: "Quality", current: 74, previous: 78 },
  { metric: "Clarity", current: 91, previous: 71 },
  { metric: "Reach", current: 63, previous: 58 },
  { metric: "Trust", current: 87, previous: 79 },
];

const seriesConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig;

const mixConfig = {
  visitors: { label: "Visitors" },
  direct: { label: "Direct", color: "var(--chart-1)" },
  search: { label: "Search", color: "var(--chart-2)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
  social: { label: "Social", color: "var(--chart-4)" },
} satisfies ChartConfig;

const radarConfig = {
  current: { label: "Current", color: "var(--chart-1)" },
  previous: { label: "Previous", color: "var(--chart-2)" },
} satisfies ChartConfig;

const radialData = [{ name: "Complete", value: 73, fill: "var(--color-value)" }];
const radialConfig = { value: { label: "Complete", color: "var(--chart-1)" } } satisfies ChartConfig;

const seriesSnippetData = `const data = [
  { month: "Jan", desktop: 186, mobile: 92 },
  { month: "Feb", desktop: 242, mobile: 121 },
  { month: "Mar", desktop: 214, mobile: 156 },
  { month: "Apr", desktop: 289, mobile: 171 },
]
const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig`;

function chartSnippet(imports: string, data: string, body: string) {
  return `${imports}\nimport { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"\n\n${data}\n\nexport default function Example() {\n  return (\n${body}\n  )\n}\n`;
}

const chartSnippets: Record<string, string> = {
  area: chartSnippet(
    'import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"',
    seriesSnippetData,
    `    <ChartContainer config={config} className="min-h-[260px] w-full">
      <AreaChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Area dataKey="desktop" type="monotone" fill="var(--color-desktop)" fillOpacity={0.18} stroke="var(--color-desktop)" />
        <Area dataKey="mobile" type="monotone" fill="var(--color-mobile)" fillOpacity={0.1} stroke="var(--color-mobile)" />
      </AreaChart>
    </ChartContainer>`,
  ),
  bar: chartSnippet(
    'import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"',
    seriesSnippetData,
    `    <ChartContainer config={config} className="min-h-[260px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>`,
  ),
  line: chartSnippet(
    'import { CartesianGrid, Line, LineChart, XAxis } from "recharts"',
    seriesSnippetData,
    `    <ChartContainer config={config} className="min-h-[260px] w-full">
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Line dataKey="desktop" type="monotone" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
        <Line dataKey="mobile" type="monotone" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>`,
  ),
  donut: chartSnippet(
    'import { Cell, Label, Pie, PieChart } from "recharts"',
    `const data = [
  { channel: "Direct", visitors: 38, fill: "var(--color-direct)" },
  { channel: "Search", visitors: 29, fill: "var(--color-search)" },
  { channel: "Referral", visitors: 21, fill: "var(--color-referral)" },
  { channel: "Social", visitors: 12, fill: "var(--color-social)" },
]
const config = {
  visitors: { label: "Visitors" },
  direct: { label: "Direct", color: "var(--chart-1)" },
  search: { label: "Search", color: "var(--chart-2)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
  social: { label: "Social", color: "var(--chart-4)" },
} satisfies ChartConfig`,
    `    <ChartContainer config={config} className="min-h-[280px] w-full">
      <PieChart accessibilityLayer>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="channel" />} />
        <Pie data={data} dataKey="visitors" nameKey="channel" innerRadius={58} outerRadius={84}>
          {data.map((entry) => <Cell key={entry.channel} fill={entry.fill} />)}
          <Label value="100%" position="center" />
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="channel" />} />
      </PieChart>
    </ChartContainer>`,
  ),
  radar: chartSnippet(
    'import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"',
    `const data = [
  { metric: "Speed", current: 82, previous: 67 },
  { metric: "Quality", current: 74, previous: 78 },
  { metric: "Clarity", current: 91, previous: 71 },
  { metric: "Reach", current: 63, previous: 58 },
]
const config = {
  current: { label: "Current", color: "var(--chart-1)" },
  previous: { label: "Previous", color: "var(--chart-2)" },
} satisfies ChartConfig`,
    `    <ChartContainer config={config} className="min-h-[300px] w-full">
      <RadarChart accessibilityLayer data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Radar dataKey="current" fill="var(--color-current)" fillOpacity={0.2} stroke="var(--color-current)" />
        <Radar dataKey="previous" fill="var(--color-previous)" fillOpacity={0.08} stroke="var(--color-previous)" />
        <ChartLegend content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>`,
  ),
  radial: chartSnippet(
    'import { Label, PolarAngleAxis, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"',
    `const data = [{ name: "Complete", value: 73, fill: "var(--color-value)" }]
const config = {
  value: { label: "Complete", color: "var(--chart-1)" },
} satisfies ChartConfig`,
    `    <ChartContainer config={config} className="min-h-[280px] w-full">
      <RadialBarChart accessibilityLayer data={data} innerRadius={72} outerRadius={104} startAngle={90} endAngle={450}>
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <RadialBar dataKey="value" background cornerRadius={8} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label value="73%" position="center" />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>`,
  ),
};

function ChartExample({ name, description, code, children }: { name: string; description: string; code: string; children: React.ReactNode }) {
  return (
    <section className="component-example chart-example">
      <header className="component-example-header">
        <h2>{name}</h2>
        <p>{description}</p>
      </header>
      <div className="chart-preview">{children}</div>
      <CodeDisclosure title={name} code={code} />
    </section>
  );
}

export function ChartGallery() {
  return (
    <div className="chart-gallery">
      <ChartExample name="Area chart" description="Two traffic series with a restrained fill." code={chartSnippets.area}>
        <ChartContainer config={seriesConfig} className="min-h-[260px] w-full">
          <AreaChart accessibilityLayer data={monthlyData} margin={{ left: 4, right: 12, top: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area dataKey="desktop" type="monotone" fill="var(--color-desktop)" fillOpacity={0.18} stroke="var(--color-desktop)" strokeWidth={2} />
            <Area dataKey="mobile" type="monotone" fill="var(--color-mobile)" fillOpacity={0.1} stroke="var(--color-mobile)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      </ChartExample>

      <ChartExample name="Bar chart" description="Grouped values make two device classes easy to compare." code={chartSnippets.bar}>
        <ChartContainer config={seriesConfig} className="min-h-[260px] w-full">
          <BarChart accessibilityLayer data={monthlyData} margin={{ left: 4, right: 12, top: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis width={32} tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </ChartExample>

      <ChartExample name="Line chart" description="A quiet line treatment keeps the change in focus." code={chartSnippets.line}>
        <ChartContainer config={seriesConfig} className="min-h-[260px] w-full">
          <LineChart accessibilityLayer data={monthlyData} margin={{ left: 4, right: 12, top: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Line dataKey="desktop" type="monotone" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
            <Line dataKey="mobile" type="monotone" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </ChartExample>

      <ChartExample name="Donut chart" description="Channel share with a direct label in the center." code={chartSnippets.donut}>
        <ChartContainer config={mixConfig} className="mx-auto min-h-[280px] w-full max-w-[440px]">
          <PieChart accessibilityLayer>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="channel" />} />
            <Pie data={mixData} dataKey="visitors" nameKey="channel" innerRadius={58} outerRadius={84} strokeWidth={2}>
              {mixData.map((entry) => <Cell key={entry.channel} fill={entry.fill} />)}
              <Label value="100%" position="center" className="fill-foreground text-lg font-medium" />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="channel" />} />
          </PieChart>
        </ChartContainer>
      </ChartExample>

      <ChartExample name="Radar chart" description="A compact profile across five comparable measures." code={chartSnippets.radar}>
        <ChartContainer config={radarConfig} className="mx-auto min-h-[300px] w-full max-w-[480px]">
          <RadarChart accessibilityLayer data={radarData} outerRadius="68%">
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tickLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Radar dataKey="current" fill="var(--color-current)" fillOpacity={0.2} stroke="var(--color-current)" strokeWidth={2} />
            <Radar dataKey="previous" fill="var(--color-previous)" fillOpacity={0.08} stroke="var(--color-previous)" />
            <ChartLegend content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </ChartExample>

      <ChartExample name="Radial chart" description="One progress value with the remaining track still visible." code={chartSnippets.radial}>
        <ChartContainer config={radialConfig} className="mx-auto min-h-[280px] w-full max-w-[420px]">
          <RadialBarChart accessibilityLayer data={radialData} innerRadius={72} outerRadius={104} startAngle={90} endAngle={450}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <RadialBar dataKey="value" background cornerRadius={8} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => viewBox && "cx" in viewBox && "cy" in viewBox ? (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-lg font-medium">73%</text>
                ) : null}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </ChartExample>
    </div>
  );
}
