"use client";

import React, { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, ChevronLeft, ChevronRight } from "lucide-react";

export type ColumnDef<T> = {
  accessorKey?: keyof T | string;
  id?: string;
  header: string;
  cell?: (info: { getValue: () => unknown; row: { original: T } }) => React.ReactNode;
};

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
}

function getNestedValue(row: Record<string, unknown>, key: string): unknown {
  if (key.includes(".")) {
    return key.split(".").reduce<unknown>((acc, part) => {
      if (acc && typeof acc === "object" && part in (acc as object)) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, row);
  }
  return row[key];
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchKeys,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 15;

  const keysToSearch = useMemo(() => {
    if (searchKeys?.length) return searchKeys.map(String);
    return columns
      .map((col) => (col.accessorKey ? String(col.accessorKey) : col.id))
      .filter(Boolean) as string[];
  }, [columns, searchKeys]);

  const filtered = useMemo(() => {
    const query = globalFilter.trim().toLowerCase();
    let rows = data;

    if (query) {
      rows = data.filter((row) =>
        keysToSearch.some((key) => {
          const value = getNestedValue(row, key);
          return value != null && String(value).toLowerCase().includes(query);
        })
      );
    }

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = getNestedValue(a, sortKey);
        const bv = getNestedValue(b, sortKey);
        const aStr = av == null ? "" : String(av);
        const bStr = bv == null ? "" : String(bv);
        const cmp = aStr.localeCompare(bStr, undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return rows;
  }, [data, globalFilter, keysToSearch, sortDir, sortKey]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal-400)] w-4 h-4" />
        <input
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            setPageIndex(0);
          }}
          placeholder={searchPlaceholder}
          className="input-base pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-charcoal-800)] border-b border-white/10">
              {columns.map((column) => {
                const key = column.accessorKey ? String(column.accessorKey) : column.id || column.header;
                const sorted = sortKey === key;
                return (
                  <th
                    key={key}
                    className="px-4 py-3 text-left font-semibold text-[var(--color-charcoal-300)] text-xs uppercase tracking-wide"
                  >
                    <button
                      type="button"
                      onClick={() => column.accessorKey && toggleSort(String(column.accessorKey))}
                      className={`flex items-center gap-1 ${column.accessorKey ? "cursor-pointer select-none hover:text-white" : ""}`}
                    >
                      {column.header}
                      {column.accessorKey && (
                        <span className="ml-1">
                          {sorted && sortDir === "asc" ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[var(--color-brand-500)]" />
                          ) : sorted && sortDir === "desc" ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[var(--color-brand-500)]" />
                          ) : (
                            <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[var(--color-charcoal-400)]">
                  No records found.
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-white/10 transition-colors hover:bg-white/5 ${i % 2 === 0 ? "bg-[var(--color-charcoal-800)]" : "bg-[var(--color-charcoal-900)]/30"}`}
                >
                  {columns.map((column) => {
                    const key = column.accessorKey ? String(column.accessorKey) : column.id || column.header;
                    const getValue = () => (column.accessorKey ? getNestedValue(row, String(column.accessorKey)) : undefined);
                    return (
                      <td key={key} className="px-4 py-3 text-white/90">
                        {column.cell
                          ? column.cell({ getValue, row: { original: row } })
                          : getValue() != null
                            ? String(getValue())
                            : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--color-charcoal-400)]">
        <span>
          Page {pageIndex + 1} of {pageCount} — {filtered.length} records
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            disabled={pageIndex === 0}
            className="p-1.5 rounded-md border border-white/10 disabled:opacity-40 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
            disabled={pageIndex >= pageCount - 1}
            className="p-1.5 rounded-md border border-white/10 disabled:opacity-40 hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


