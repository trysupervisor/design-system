"use client";

import { useState } from "react";
import { ArrowUpRightIcon, CheckIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeDisclosure } from "@/components/code-disclosure";
import { Device, deviceFrames, type DeviceModel } from "./registry/device";

const models = ["iphone", "ipad", "macbook", "android"] as const;
const labels = { iphone: "iPhone", ipad: "iPad", macbook: "MacBook", android: "Android" };
const sources = {
  iphone: "https://www.webmobilefirst.com/en/mockups/apple-iphone-17-2025/",
  ipad: "https://www.webmobilefirst.com/en/mockups/apple-ipad-pro-11-2018/",
  macbook: "https://commons.wikimedia.org/wiki/File:MacBook_Pro_(14-inch,_M5,_Space_Black).jpg",
  android: "https://www.webmobilefirst.com/en/mockups/samsung-galaxy-s26-ultra-2026/",
};

function DemoScreen({ compact }: { compact: boolean }) {
  const [view, setView] = useState<"overview" | "activity">("overview");
  return (
    <div className={`h-full overflow-auto bg-background text-foreground ${compact ? "px-[7cqi] pt-[23cqi] pb-[10cqi] text-[4cqi]" : "p-[5cqi] text-[2.1cqi]"}`}>
      <div className="flex items-center justify-between border-b border-border pb-[4cqi]">
        <span className="font-semibold tracking-tight">Fieldwork</span>
        <span className="flex size-[7cqi] max-h-8 max-w-8 items-center justify-center rounded-full bg-secondary text-[0.75em] font-medium">MO</span>
      </div>
      <div className="mt-[5cqi] flex gap-[5cqi] text-[0.85em]" aria-label="Demo views">
        {(["overview", "activity"] as const).map((item) => <button key={item} type="button" aria-pressed={view === item} onClick={() => setView(item)} className={`border-b-2 pb-[2cqi] capitalize transition-colors ${view === item ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>{item}</button>)}
      </div>
      <div className="mt-[6cqi] flex items-start justify-between gap-[3cqi]">
        <div><p className="text-[0.85em] text-muted-foreground">Your workspace</p><h3 className="mt-[2cqi] text-[1.55em] font-semibold tracking-tight">{view === "overview" ? "A little more done." : "The latest work."}</h3></div>
        {!compact && <span className="flex items-center gap-1 rounded-[var(--radius)] bg-primary px-[2cqi] py-[1cqi] text-[0.8em] text-primary-foreground"><PlusIcon className="size-[1em]" />New project</span>}
      </div>
      {view === "overview" ? (
        <>
          <div className={`mt-[6cqi] grid gap-[3cqi] ${compact ? "grid-cols-2" : "grid-cols-3"}`}>
            {[{ label: "Completed", value: "28" }, { label: "In progress", value: "7" }, ...(!compact ? [{ label: "On schedule", value: "96%" }] : [])].map((item) => <div key={item.label} className="rounded-[var(--radius)] border border-border p-[3cqi]"><p className="text-[0.7em] text-muted-foreground">{item.label}</p><p className="mt-[2cqi] text-[1.7em] font-semibold tabular-nums">{item.value}</p></div>)}
          </div>
          <div className="mt-[5cqi] rounded-[var(--radius)] border border-border p-[4cqi]">
            <div className="flex justify-between text-[0.8em]"><span className="font-medium">Weekly progress</span><span className="text-muted-foreground">This week</span></div>
            <div className={`mt-[4cqi] flex items-end gap-[2cqi] ${compact ? "h-[27cqi]" : "h-[13cqi]"}`} aria-hidden="true">{[37, 61, 48, 79, 58, 92, 73].map((height, index) => <div key={index} className="flex-1 rounded-t-sm bg-primary" style={{ height: `${height}%`, opacity: index === 5 ? 1 : 0.35 + index * 0.07 }} />)}</div>
          </div>
        </>
      ) : null}
      <div className="mt-[5cqi]">
        <p className="mb-[2cqi] text-[0.8em] font-medium">{view === "overview" ? "Up next" : "Completed today"}</p>
        {["Review the new navigation", "Share the weekly update", "Publish the component guide"].map((title, index) => <div key={title} className="flex items-center gap-[3cqi] border-b border-border py-[3cqi] text-[0.75em]"><span className="flex size-[1.4em] shrink-0 items-center justify-center rounded-full border border-border">{view === "activity" ? <CheckIcon className="size-[1em]" /> : index + 1}</span><span>{title}</span></div>)}
      </div>
    </div>
  );
}

export function DeviceExample() {
  const [model, setModel] = useState<DeviceModel>("iphone");
  const compact = model === "iphone" || model === "android";
  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Device model">
          {models.map((item) => <Button key={item} type="button" variant={model === item ? "default" : "outline"} size="sm" aria-pressed={model === item} onClick={() => setModel(item)}>{labels[item]}</Button>)}
        </div>
        <span className="text-xs text-muted-foreground" role="status">{deviceFrames[model].name}</span>
      </div>
      <div className="flex min-h-[580px] items-center justify-center overflow-hidden rounded-lg bg-muted/40 px-4 py-7 sm:px-8">
        <Device key={model} model={model} frameSrc={model === "macbook" ? "/devices/macbook-pro-14-space-black.png" : undefined} className={compact ? "max-w-[260px]" : model === "ipad" ? "max-w-[390px]" : "max-w-[740px]"} aria-label={`${deviceFrames[model].name} preview`}>
          <DemoScreen compact={compact} />
        </Device>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>Real PNG frame. Try Overview and Activity inside the screen.</p>
        <a href={sources[model]} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4">Frame source<ArrowUpRightIcon className="size-3" /></a>
      </div>
    </div>
  );
}

const imageCode = `import Image from "next/image"
import { Device } from "@/components/ui/device"

export default function Example() {
  return (
    <Device model="iphone" className="max-w-xs">
      <Image
        src="/dashboard.png"
        alt="Project dashboard with weekly activity"
        fill
        sizes="320px"
        className="object-cover object-top"
      />
    </Device>
  )
}`;

export function DeviceDetails() {
  return (
    <>
      <section className="component-docs-section">
        <h2>Use your content</h2>
        <p>Place a screenshot, video, or React content inside Device. The PNG stays above the screen and lets pointer events reach your content. Screen bounds scale with the frame.</p>
        <div className="component-frame"><CodeDisclosure title="Device screenshot" code={imageCode} /></div>
        <p className="mt-4">Give screenshots descriptive alt text and embedded pages a title. The frame is decorative. Keep controls clear of the camera cutout, and respect reduced motion when playing video.</p>
        <p>Menus and dialogs that use a portal outside Device will also appear outside its screen. For a complete page preview with contained overlays, place an iframe inside Device.</p>
      </section>
      <section className="component-docs-section">
        <h2>Frame options</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm"><thead className="border-b bg-muted/30"><tr><th className="p-3 font-medium">Prop</th><th className="p-3 font-medium">Use</th></tr></thead><tbody className="divide-y">
            <tr><td className="p-3 font-mono text-xs">model</td><td className="p-3">iphone, ipad, macbook, or android. Defaults to iphone.</td></tr>
            <tr><td className="p-3 font-mono text-xs">className / style</td><td className="p-3">Set the outer width. The frame keeps its proportions.</td></tr>
            <tr><td className="p-3 font-mono text-xs">screenClassName / screenStyle</td><td className="p-3">Style the content area without changing its measured bounds.</td></tr>
            <tr><td className="p-3 font-mono text-xs">frameSrc</td><td className="p-3">Use your own copy of the selected PNG with the same dimensions.</td></tr>
            <tr><td className="p-3 font-mono text-xs">frame</td><td className="p-3">Supply another PNG with its width, height, and screen coordinates.</td></tr>
          </tbody></table>
        </div>
      </section>
      <section className="component-docs-section">
        <h2>Image sources</h2>
        <p>The iPhone, iPad, and Android presets load PNGs from Mobile FIRST. Its image terms permit personal and commercial presentations but prohibit distributing the frame files alone.</p>
        <p>The MacBook frame is a retouched adaptation of AzureSaturn&apos;s CC0 photograph of the M5 MacBook Pro. We reconstructed a front view and removed the background and screen. This PNG is hosted by Supervisor and released under CC0. The registry includes source links and image notices.</p>
        <p>For control over availability, host an authorized frame PNG with your app and set <code>frameSrc</code> to its local path. You can <a href="/devices/macbook-pro-14-space-black.png" download className="underline underline-offset-4">download the MacBook PNG</a> here. Device does not require a Next.js remote image configuration.</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">{models.map((model) => <a key={model} href={sources[model]} target="_blank" rel="noreferrer" className="underline underline-offset-4">{deviceFrames[model].name}</a>)}</div>
      </section>
    </>
  );
}
