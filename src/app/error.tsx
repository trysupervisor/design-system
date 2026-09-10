"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) { return <div className="py-20"><h1 className="page-title">This page could not load.</h1><p className="page-description">Try again to reload the example.</p><Button className="mt-6" onClick={reset}>Try again</Button></div>; }
