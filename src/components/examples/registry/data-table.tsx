"use client";

import * as React from "react";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type DataTableColumn<Row> = {
  key: keyof Row & string;
  label: string;
  align?: "left" | "right";
  sortable?: boolean;
  render?: (value: Row[keyof Row], row: Row) => React.ReactNode;
};

export function DataTable<Row extends Record<string, unknown>>({ rows, columns, getRowId, emptyMessage = "No results." }: { rows: Row[]; columns: DataTableColumn<Row>[]; getRowId: (row: Row) => React.Key; emptyMessage?: string }) {
  const [sort, setSort] = React.useState<{ key: keyof Row & string; direction: "ascending" | "descending" }>();
  const sortedRows = React.useMemo(() => {
    if (!sort) return rows;
    return [...rows].sort((left, right) => {
      const a = left[sort.key];
      const b = right[sort.key];
      const result = String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true });
      return sort.direction === "ascending" ? result : result * -1;
    });
  }, [rows, sort]);

  function changeSort(key: keyof Row & string) {
    setSort((current) => current?.key === key && current.direction === "ascending" ? { key, direction: "descending" } : { key, direction: "ascending" });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>{columns.map((column) => <TableHead key={column.key} className={column.align === "right" ? "text-right" : undefined}>{column.sortable ? <Button variant="ghost" size="sm" onClick={() => changeSort(column.key)} aria-label={`Sort by ${column.label}`}>{column.label}{sort?.key !== column.key ? <ArrowUpDownIcon /> : sort.direction === "ascending" ? <ArrowUpIcon /> : <ArrowDownIcon />}</Button> : column.label}</TableHead>)}</TableRow>
      </TableHeader>
      <TableBody>
        {sortedRows.length ? sortedRows.map((row) => <TableRow key={getRowId(row)}>{columns.map((column) => <TableCell key={column.key} className={column.align === "right" ? "text-right" : undefined}>{column.render ? column.render(row[column.key], row) : String(row[column.key] ?? "")}</TableCell>)}</TableRow>) : <TableRow><TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">{emptyMessage}</TableCell></TableRow>}
      </TableBody>
    </Table>
  );
}
