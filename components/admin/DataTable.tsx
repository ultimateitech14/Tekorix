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
          ? "border-[#D4E8FC] bg-[linear-gradient(145deg,#F9FCFF_0%,#EDF6FF_100%)]"
          : "border-[#D4E8FC] bg-[#F8FBFF]",
      )}
    >
      {title || actions ? (
        <CardHeader className="space-y-3 px-4 pb-4 pt-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              {title ? (
                <CardTitle
                  className={cn(
                    "text-lg text-slate-900 sm:text-xl",
                    ENABLE_ADMIN_LIGHTER_TYPE ? "font-medium" : "font-semibold",
                  )}
                >
                  {title}
                </CardTitle>
              ) : null}
              {description ? <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p> : null}
            </div>
            {actions ? <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">{actions}</div> : null}
          </div>
        </CardHeader>
      ) : null}

      <CardContent className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
        <div
          className={cn(
            "overflow-hidden rounded-lg border",
            ENABLE_ADMIN_UI_REFRESH ? "border-[#D4E8FC]" : "border-[#D4E8FC]",
          )}
        >
          <Table className="min-w-[42rem]">
            <TableHeader>
              <TableRow
                className={cn(
                  "hover:bg-transparent",
                  ENABLE_ADMIN_UI_REFRESH ? "border-[#D4E8FC] bg-[#F4F9FF]" : "border-[#D4E8FC]",
                )}
              >
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      "text-xs tracking-[0.04em] text-slate-500",
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
                      "hover:bg-[#F1F7FF]",
                      ENABLE_ADMIN_UI_REFRESH ? "border-[#D4E8FC]" : "border-[#D4E8FC]",
                    )}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id} className={cn("py-3 text-sm text-slate-700 sm:py-4", column.className)}>
                        {column.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className={cn(ENABLE_ADMIN_UI_REFRESH ? "border-[#D4E8FC]" : "border-[#D4E8FC]")}>
                  <TableCell colSpan={columns.length} className="py-8 text-center text-sm text-slate-500">
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

