"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import DataTable, { type ColumnDef } from "@/components/admin/DataTable";
import { Pencil, Trash2 } from "lucide-react";

type Location = {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  order: number;
  _count?: { properties: number };
};

export default function LocationsTable({ locations }: { locations: Location[] }) {
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/admin/locations/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const columns: ColumnDef<Location>[] = [
    { accessorKey: "name", header: "Name", cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span> },
    { accessorKey: "slug", header: "Slug", cell: ({ getValue }) => <span className="text-xs font-mono text-[var(--color-charcoal-400)]">{getValue() as string}</span> },
    { accessorKey: "order", header: "Order" },
    {
      accessorKey: "published",
      header: "Published",
      cell: ({ getValue }) => (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getValue() ? "bg-emerald-900/30 text-emerald-400" : "bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-300)]"}`}>
          {getValue() ? "Yes" : "No"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/admin/locations/${row.original.id}/edit`} className="p-1.5 rounded-md hover:bg-white/5 text-[var(--color-charcoal-400)]">
            <Pencil className="w-3.5 h-3.5" />
          </Link>
          <button onClick={() => handleDelete(row.original.id, row.original.name)} className="p-1.5 rounded-md hover:bg-red-900/20 text-[var(--color-charcoal-400)] hover:text-red-400">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return <DataTable data={locations} columns={columns} searchPlaceholder="Search locations..." />;
}
