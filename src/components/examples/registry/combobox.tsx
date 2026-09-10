"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "cn";

export type ComboboxOption = { value: string; label: string; disabled?: boolean };

export function Combobox(props: { options: ComboboxOption[]; value?: string; onValueChange?: (value: string) => void; placeholder?: string; searchPlaceholder?: string; emptyMessage?: string; className?: string }) {
  const { options, value, onValueChange, placeholder = "Choose an option", searchPlaceholder = "Search options", emptyMessage = "No option found.", className } = props;
  const controlled = Object.prototype.hasOwnProperty.call(props, "value");
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value ?? "");
  const selectedValue = controlled ? value : internalValue;
  const selected = options.find((option) => option.value === selectedValue);

  function select(nextValue: string) {
    if (!controlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger data-slot="button" data-variant="outline" data-size="default" role="combobox" aria-expanded={open} className={cn(buttonVariants({ variant: "outline" }), "justify-between", className)}>
        {selected?.label ?? placeholder}
        <ChevronsUpDownIcon className="opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width,var(--anchor-width))] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option.value} value={option.label} disabled={option.disabled} onSelect={() => select(option.value)}>
                  {option.label}
                  <CheckIcon className={cn("ml-auto", selectedValue === option.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
