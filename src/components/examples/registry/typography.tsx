import * as React from "react";
import { cn } from "cn";

export function TypographyH1({ className, ...props }: React.ComponentProps<"h1">) { return <h1 className={cn("scroll-m-20 text-4xl font-semibold tracking-tight", className)} {...props} />; }
export function TypographyH2({ className, ...props }: React.ComponentProps<"h2">) { return <h2 className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight", className)} {...props} />; }
export function TypographyP({ className, ...props }: React.ComponentProps<"p">) { return <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />; }
export function TypographyLead({ className, ...props }: React.ComponentProps<"p">) { return <p className={cn("text-xl text-muted-foreground", className)} {...props} />; }
export function TypographyBlockquote({ className, ...props }: React.ComponentProps<"blockquote">) { return <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props} />; }
export function TypographyCode({ className, ...props }: React.ComponentProps<"code">) { return <code className={cn("rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-medium", className)} {...props} />; }
