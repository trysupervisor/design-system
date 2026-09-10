"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "cn";

export function DatePicker(props: { value?: Date; onValueChange?: (date: Date | undefined) => void; placeholder?: string; className?: string }) {
  const { value, onValueChange, placeholder = "Choose a date", className } = props;
  const controlled = Object.prototype.hasOwnProperty.call(props, "value");
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(value);
  const date = controlled ? value : internalDate;

  function select(nextDate: Date | undefined) {
    if (!controlled) setInternalDate(nextDate);
    onValueChange?.(nextDate);
  }

  return (
    <Popover>
      <PopoverTrigger data-slot="button" data-variant="outline" data-size="default" className={cn(buttonVariants({ variant: "outline" }), "justify-start font-normal", className)}>
        <CalendarIcon />
        {date ? date.toLocaleDateString(undefined, { dateStyle: "long" }) : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={select} defaultMonth={date} />
      </PopoverContent>
    </Popover>
  );
}
