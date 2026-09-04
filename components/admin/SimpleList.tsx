"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import DataTable, { type ColumnDef } from "@/components/admin/DataTable";
import { Pencil, Trash2 } from "lucide-react";

type Item = {
  id: string;
  name: string;
  subtitle?: string;
  published?: boolean;
  editHref: string;
  deleteApi: string;
};

export default function SimpleList({ items, searchPlaceholder }: { items: Item[]; searchPlaceholder: string }) {
  const router = useRouter();

  const handleDelete = async (item: Item) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    await fetch(item.deleteApi, { method: "DELETE" });
    router.refresh();
  };

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div>
          <span className="font-medium">{row.original.name}</span>
          {row.original.subtitle && (
            <p className="text-xs text-[var(--color-charcoal-400)]">{row.original.subtitle}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "published",
      header: "Published",
      cell: ({ getValue }) => {
        const v = getValue() as boolean | undefined;
        if (v === undefined) return null;
        return (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v ? "bg-emerald-900/30 text-emerald-400" : "bg-gray-100 text-gray-500"}`}>
            {v ? "Yes" : "No"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={row.original.editHref} className="p-1.5 rounded-md hover:bg-white/5">
            <Pencil className="w-3.5 h-3.5" />
          </Link>
          <button onClick={() => handleDelete(row.original)} className="p-1.5 rounded-md hover:bg-red-900/20 hover:text-red-500">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return <DataTable data={items} columns={columns} searchPlaceholder={searchPlaceholder} />;
}
