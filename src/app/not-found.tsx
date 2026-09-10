import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <div className="py-20"><p className="eyebrow mb-4">404</p><h1 className="page-title">This page is not in the system.</h1><p className="page-description">Browse the component catalog or head back to the introduction.</p><Button className="mt-6" asChild><Link href="/components">Browse components</Link></Button></div>; }
