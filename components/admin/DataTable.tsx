"use client";

import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ENABLE_ADMIN_LIGHTER_TYPE, ENABLE_ADMIN_UI_REFRESH } from "@/lib/ui-flags";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
};

type DataTableProps<T> = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  emptyMessage?: string;
  footer?: ReactNode;
};

export function DataTable<T>({
  title,
  description,
  actions,
  columns,
  data,
  getRowId,
  emptyMessage = "No records found.",
  footer,
}: DataTableProps<T>) {
  return (
    <Card
      className={cn(
        "backdrop-blur-xl",
        ENABLE_ADMIN_UI_REFRESH
          ? "border-white/[0.12] bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))]"
          : "border-white/10 bg-white/5",
      )}
    >
      {title || actions ? (
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              {title ? (
                <CardTitle
                  className={cn(
                    "text-[1.2rem] text-white",
                    ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
                  )}
                >
                  {title}
                </CardTitle>
              ) : null}
              {description ? <p className="mt-1 text-[0.9rem] leading-relaxed text-slate-400">{description}</p> : null}
            </div>
            {actions}
          </div>
        </CardHeader>
      ) : null}

      <CardContent className="space-y-4">
        <div
          className={cn(
            "overflow-hidden rounded-lg border",
            ENABLE_ADMIN_UI_REFRESH ? "border-white/[0.12]" : "border-white/10",
          )}
        >
          <Table>
            <TableHeader>
              <TableRow
                className={cn(
                  "hover:bg-transparent",
                  ENABLE_ADMIN_UI_REFRESH ? "border-white/[0.12] bg-white/[0.04]" : "border-white/10",
                )}
              >
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      "text-[0.78rem] tracking-[0.04em] text-slate-400",
                      ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
                      column.headerClassName,
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length ? (
                data.map((row) => (
                  <TableRow
                    key={getRowId(row)}
                    className={cn(
                      "hover:bg-white/[0.06]",
                      ENABLE_ADMIN_UI_REFRESH ? "border-white/[0.12]" : "border-white/10",
                    )}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id} className={cn("py-3 text-[0.92rem] text-slate-200", column.className)}>
                        {column.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className={cn(ENABLE_ADMIN_UI_REFRESH ? "border-white/[0.12]" : "border-white/10")}>
                  <TableCell colSpan={columns.length} className="py-8 text-center text-sm text-slate-400">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {footer}
      </CardContent>
    </Card>
  );
}
