"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "cn";

export function DatePicker({ value, onValueChange, placeholder = "Choose a date", className }: { value?: Date; onValueChange?: (date: Date | undefined) => void; placeholder?: string; className?: string }) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(value);
  const date = value ?? internalDate;

  function select(nextDate: Date | undefined) {
    setInternalDate(nextDate);
    onValueChange?.(nextDate);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("justify-start font-normal", className)}>
          <CalendarIcon />
          {date ? date.toLocaleDateString(undefined, { dateStyle: "long" }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={select} defaultMonth={date} />
      </PopoverContent>
    </Popover>
  );
}
