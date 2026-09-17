"use client";

import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "cn";

export type ComboboxOption = { value: string; label: string; disabled?: boolean };

export type ComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  label?: string;
  disabled?: boolean;
  name?: string;
  form?: string;
  id?: string;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

function ComboboxList({ children }: { children: React.ReactNode }) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number>();
  const [animate, setAnimate] = React.useState(false);

  React.useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    let frame = 0;
    const update = () => setHeight(content.getBoundingClientRect().height);
    update();
    frame = requestAnimationFrame(() => setAnimate(true));
    const observer = new ResizeObserver(update);
    observer.observe(content);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      data-slot="combobox-list-wrapper"
      data-animate={animate || undefined}
      className="overflow-hidden data-animate:transition-[height] data-animate:duration-100 data-animate:ease-in-out"
      style={height === undefined ? undefined : { height }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

export function Combobox(props: ComboboxProps) {
  const {
    options,
    value,
    defaultValue = "",
    onValueChange,
    placeholder = "Choose an option",
    searchPlaceholder = "Search options",
    emptyMessage = "No option found.",
    label,
    disabled = false,
    name,
    form,
    id,
    className,
    contentClassName,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  } = props;
  const controlled = Object.prototype.hasOwnProperty.call(props, "value");
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selectedValue = controlled ? value : internalValue;
  const selected = options.find((option) => option.value === selectedValue);
  const generatedId = React.useId();
  const triggerId = id ?? `${generatedId}-trigger`;
  const labelId = `${triggerId}-label`;

  if (disabled && open) setOpen(false);

  function select(nextValue: string) {
    if (!controlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    setOpen(false);
  }

  return (
    <div data-slot="combobox" className="grid w-full gap-2">
      {label && <label id={labelId} htmlFor={triggerId} className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={(nextOpen) => (!nextOpen || !disabled) && setOpen(nextOpen)}>
        <PopoverTrigger
          id={triggerId}
          data-slot="combobox-trigger"
          data-variant="outline"
          data-size="default"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabelledBy || label ? ariaLabel : ariaLabel ?? placeholder}
          aria-labelledby={ariaLabelledBy ?? (label ? labelId : undefined)}
          disabled={disabled}
          className={cn(buttonVariants({ variant: "outline" }), "group/combobox-trigger w-full min-w-0 justify-between", className)}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDownIcon data-slot="combobox-trigger-icon" className="shrink-0 opacity-50 transition-transform duration-150 ease-in-out group-aria-expanded/combobox-trigger:rotate-180 group-aria-expanded/combobox-trigger:transition-none" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={1}
          data-slot="combobox-content"
          className={cn("w-[var(--radix-popover-trigger-width,var(--anchor-width))] max-w-[calc(100vw-1rem)] p-1.5", contentClassName)}
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <ComboboxList>
              <CommandList>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem key={option.value} value={option.value} keywords={[option.label]} disabled={option.disabled} onSelect={() => select(option.value)}>
                      <span className="min-w-0 flex-1 truncate">{option.label}</span>
                      <CheckIcon aria-hidden="true" className={cn("ml-auto shrink-0", selectedValue === option.value ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </ComboboxList>
          </Command>
        </PopoverContent>
      </Popover>
      {name && <input type="hidden" name={name} value={selectedValue ?? ""} disabled={disabled} form={form} />}
    </div>
  );
}
