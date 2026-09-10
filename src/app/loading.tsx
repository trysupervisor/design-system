import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() { return <div aria-label="Loading page" className="space-y-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-5 w-3/4" /><Skeleton className="h-80 w-full" /></div>; }
