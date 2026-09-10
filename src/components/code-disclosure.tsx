"use client";

import { useState } from "react";
import { ChevronRightIcon, CopyIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function CodeDisclosure({ title, code, language = "tsx" }: { title: string; code: string; language?: "tsx" | "css" | "sh" | "json" }) {
  const [open, setOpen] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied");
    } catch {
      toast.error("Could not copy the code. Select the text to copy it manually.");
    }
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="code-disclosure">
      <CollapsibleTrigger className="code-disclosure-trigger" aria-label={`${open ? "Hide" : "Show"} code for ${title}`}>
        <ChevronRightIcon aria-hidden="true" />
        <span>{open ? "Hide code" : "Show code"}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="code-disclosure-content">
        <div className="code-disclosure-toolbar">
          <span>Usage · {language.toUpperCase()}</span>
          <Button variant="ghost" size="icon-sm" aria-label={`Copy code for ${title}`} onClick={copyCode}>
            <CopyIcon />
          </Button>
        </div>
        <pre tabIndex={0} aria-label={`${title} code`}><code>{code}</code></pre>
      </CollapsibleContent>
    </Collapsible>
  );
}
