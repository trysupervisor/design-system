"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRightIcon, ArrowTopRightIcon, CheckIcon, CopyIcon, CubeIcon, MixerHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { COMPONENTS } from "@/lib/component-catalog";
import { useTheme } from "@/components/theme-provider";

export function CopyCommand({ command }: { command: string }) {
  async function copy() { try { await navigator.clipboard.writeText(command); toast.success("Command copied"); } catch { toast.error("Could not copy. Select the command to copy it manually."); } }
  return <div className="flex min-w-0 items-center gap-3 rounded-lg border bg-card px-4 py-3"><span className="select-none font-mono text-xs text-muted-foreground">$</span><code className="flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap">{command}</code><Button variant="ghost" size="icon-sm" aria-label="Copy installation command" onClick={copy}><CopyIcon /></Button></div>;
}

export function Overview() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  return <>
    <div className="mb-7 flex items-center gap-2"><Badge variant="outline" className="gap-2 px-2.5 py-1 text-[11px]"><span className="size-1.5 rounded-full bg-primary" />Supervisor UI</Badge><span className="font-mono text-[10px] text-muted-foreground">v0.1.0</span></div>
    <h1 className="page-title">Supervisor Design System</h1>
    <p className="page-description">Build with shadcn components styled like Geist. Choose a preset or change the colors, type, spacing, and shape in Theme Studio.</p>
    <div className="mt-6 flex flex-wrap gap-3"><Button asChild><Link href="/components">Explore components <ArrowRightIcon /></Link></Button><Button variant="outline" asChild><Link href="/themes"><MixerHorizontalIcon />Create your theme</Link></Button></div>
    <div className="mt-10 mb-9 flex flex-wrap gap-x-8 gap-y-3 border-y py-4 text-xs text-muted-foreground"><span><strong className="mr-1.5 font-mono font-medium text-foreground">{COMPONENTS.length}</strong>components</span><span><strong className="mr-1.5 font-mono font-medium text-foreground">30+</strong>theme presets</span><span><strong className="mr-1.5 font-mono font-medium text-foreground">12</strong>font families</span><span className="ml-auto flex items-center gap-2"><span className="size-2 rounded-full bg-primary" />{theme.name} theme</span></div>
    <div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-medium">The pieces, in practice</h2><Link href="/themes" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">Change the look <ArrowTopRightIcon /></Link></div>
    <div className="intro-preview">
      <div className="space-y-6">
        <section className="panel"><div className="panel-body"><div className="mb-5 flex size-9 items-center justify-center rounded-lg border bg-background"><CubeIcon className="size-5" /></div><h3 className="text-lg font-semibold tracking-tight">Create your workspace</h3><p className="mt-2 text-xs leading-relaxed text-muted-foreground">A place for your team and the things you build.</p><form className="mt-6 space-y-4" noValidate onSubmit={event => {event.preventDefault();if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError("Enter a valid email address.");return;}setError("");toast.success("Workspace example complete",{description:"This is a preview. No account was created."});}}><div className="space-y-2"><Label htmlFor="workspace-name">Workspace name</Label><Input id="workspace-name" defaultValue="Studio North" /></div><div className="space-y-2"><Label htmlFor="workspace-email">Your email</Label><Input id="workspace-email" type="email" placeholder="you@studio.com" value={email} onChange={event => setEmail(event.target.value)} aria-invalid={!!error} aria-describedby={error ? "workspace-error" : undefined} />{error && <p id="workspace-error" role="alert" className="text-xs text-destructive">{error}</p>}</div><Button className="mt-2 w-full" type="submit">Create workspace <ArrowRightIcon /></Button></form><div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-muted-foreground"><CheckIcon />Interactive example</div></div></section>
        <section className="panel"><div className="panel-body"><div className="mb-5 flex items-center justify-between"><div><h3 className="text-sm font-medium">Your team</h3><p className="mt-1.5 text-xs text-muted-foreground">A few good people. One shared space.</p></div><Button variant="outline" size="sm" onClick={() => toast("Invite example selected")}><PlusIcon />Invite</Button></div><div className="flex items-center gap-4"><AvatarGroup>{["EL","MC","RK","JL"].map(initials=><Avatar key={initials}><AvatarFallback>{initials}</AvatarFallback></Avatar>)}</AvatarGroup><Badge variant="secondary">4 members</Badge></div></div></section>
      </div>
      <div className="space-y-6">
        <section className="panel overflow-hidden"><div className="panel-header"><h3>Usage this month</h3><Badge variant="outline">Sep</Badge></div><div className="panel-body"><div className="flex items-end justify-between"><div><p className="font-mono text-3xl font-medium tracking-tighter">24,836</p><p className="mt-2 text-xs text-muted-foreground">Events processed</p></div><Badge variant="secondary">+18.6%</Badge></div><div className="mt-8 flex h-28 items-end gap-2" role="img" aria-label="Sample daily events increasing across the month">{[28,43,32,57,46,72,61,88,70,95,83,100].map((height,index)=><div key={index} className="flex-1 rounded-t-sm bg-primary" style={{height:`${height}%`,opacity:index>8?1:.25+index*.055}} />)}</div><div className="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground"><span>SEP 01</span><span>SEP 15</span><span>SEP 30</span></div></div><Link href="/charts" className="flex items-center justify-between border-t px-6 py-3 text-xs text-muted-foreground hover:text-foreground">Explore the chart library <ArrowRightIcon /></Link></section>
        <section className="panel"><div className="panel-header"><h3>Preferences</h3><MixerHorizontalIcon className="size-4 text-muted-foreground" /></div><div className="divide-y px-6">{[{id:"notifications",title:"Notifications",text:"Updates from your workspace.",checked:true},{id:"digest",title:"Weekly digest",text:"A recap, once a week.",checked:false}].map(item=><div key={item.id} className="flex items-center justify-between gap-5 py-5"><div><Label htmlFor={item.id}>{item.title}</Label><p className="mt-1.5 text-xs text-muted-foreground">{item.text}</p></div><Switch id={item.id} defaultChecked={item.checked} /></div>)}</div></section>
        <div className="flex flex-wrap items-center gap-2"><Badge>Ready</Badge><Badge variant="secondary">In progress</Badge><Badge variant="outline">Draft</Badge><Button size="sm" variant="ghost" asChild><Link href="/components/badge">View badges <ArrowTopRightIcon /></Link></Button></div>
      </div>
    </div>
    <section className="mt-12 border-t pt-9"><div className="mb-5 flex items-center justify-between gap-4"><div><h2 className="text-lg font-semibold tracking-tight">Bring it into your project.</h2><p className="mt-2 text-sm text-muted-foreground">Install the source. Keep control of every detail.</p></div><Link href="/installation" className="shrink-0 text-xs hover:underline">Installation guide <ArrowTopRightIcon className="inline size-3" /></Link></div><CopyCommand command="bunx shadcn@latest add https://ui.trysupervisor.com/r/button.json" /></section>
  </>;
}
