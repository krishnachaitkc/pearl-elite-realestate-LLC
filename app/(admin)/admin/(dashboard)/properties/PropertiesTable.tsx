"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DataTable, { type ColumnDef } from "@/components/admin/DataTable";
import { Pencil, Trash2, Eye } from "lucide-react";

type Property = {
  id: string;
  title: string;
  propertyType: string;
  priceType: string;
  price: string;
  status: string;
  published: boolean;
  featured: boolean;
  referenceNo: string;
  createdAt: string;
  location: { name: string } | null;
  agent: { name: string } | null;
};

function PublishedToggle({
  id,
  published,
}: {
  id: string;
  published: boolean;
}) {
  const [value, setValue] = useState(published);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !value }),
      });
      if (res.ok) setValue(!value);
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
        value ? "bg-emerald-900/200" : "bg-[var(--color-charcoal-200)]"
      } disabled:opacity-50`}
      aria-label="Toggle published"
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-[var(--color-charcoal-800)] shadow transition-transform ${
          value ? "translate-x-4.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function PropertiesTable({
  properties,
}: {
  properties: Property[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/properties/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  };

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: "referenceNo",
      header: "Ref",
      cell: ({ getValue }) => (
        <span className="text-xs font-mono text-[var(--color-charcoal-400)]">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ getValue }) => (
        <span className="font-medium text-white">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "propertyType",
      header: "Type",
      cell: ({ getValue }) => (
        <span className="text-xs capitalize text-[var(--color-charcoal-300)]">
          {(getValue() as string).toLowerCase()}
        </span>
      ),
    },
    {
      accessorKey: "priceType",
      header: "For",
      cell: ({ getValue }) => {
        const v = getValue() as string;
        return (
          <span
            className={v === "SALE" ? "badge-for-sale" : "badge-for-rent"}
          >
            {v === "SALE" ? "Sale" : "Rent"}
          </span>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price (AED)",
      cell: ({ getValue }) => (
        <span className="font-semibold text-white">
          {Number(getValue()).toLocaleString("en-AE")}
        </span>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ getValue }) => {
        const loc = getValue() as { name: string } | null;
        return (
          <span className="text-[var(--color-charcoal-300)] text-xs">
            {loc?.name ?? "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const v = getValue() as string;
        return (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              v === "READY"
                ? "bg-emerald-900/30 text-emerald-400"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {v === "READY" ? "Ready" : "Off Plan"}
          </span>
        );
      },
    },
    {
      accessorKey: "published",
      header: "Published",
      cell: ({ row }) => (
        <PublishedToggle
          id={row.original.id}
          published={row.original.published}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/properties/${row.original.id}/edit`}
            className="p-1.5 rounded-md text-[var(--color-charcoal-400)] hover:text-[var(--color-brand-500)] hover:bg-white/5 transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() =>
              handleDelete(row.original.id, row.original.title)
            }
            disabled={deleting === row.original.id}
            className="p-1.5 rounded-md text-[var(--color-charcoal-400)] hover:text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={properties}
      columns={columns}
      searchPlaceholder="Search properties..."
    />
  );
}
