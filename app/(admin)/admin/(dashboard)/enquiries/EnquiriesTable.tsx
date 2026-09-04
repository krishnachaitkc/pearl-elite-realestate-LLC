"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DataTable, { type ColumnDef } from "@/components/admin/DataTable";
import { Trash2 } from "lucide-react";

type Enquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  type: string;
  status: string;
  notes: string | null;
  createdAt: string;
  property: { title: string } | null;
};

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "VIEWING_SCHEDULED", "CLOSED", "NOT_INTERESTED"];

const statusColors: Record<string, string> = {
  NEW: "bg-blue-900/40 text-blue-400",
  CONTACTED: "bg-yellow-900/40 text-yellow-400",
  QUALIFIED: "bg-purple-900/40 text-purple-400",
  VIEWING_SCHEDULED: "bg-orange-900/40 text-orange-400",
  CLOSED: "bg-green-900/40 text-green-400",
  NOT_INTERESTED: "bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-300)]",
};

function StatusSelect({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();

  const update = (newStatus: string) => {
    startTransition(async () => {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) setValue(newStatus);
    });
  };

  return (
    <select
      value={value}
      onChange={(e) => update(e.target.value)}
      disabled={isPending}
      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[value] ?? "bg-[var(--color-charcoal-800)]"} disabled:opacity-50`}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
      ))}
    </select>
  );
}

export default function EnquiriesTable({ enquiries }: { enquiries: Enquiry[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const columns: ColumnDef<Enquiry>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Contact",
      cell: ({ row }) => (
        <span className="text-xs text-[var(--color-charcoal-300)]">
          {row.original.phone || row.original.email || "—"}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ getValue }) => (
        <span className="text-xs capitalize">{(getValue() as string).toLowerCase()}</span>
      ),
    },
    {
      accessorKey: "property",
      header: "Property",
      cell: ({ getValue }) => {
        const p = getValue() as { title: string } | null;
        return <span className="text-xs">{p?.title ?? "—"}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusSelect id={row.original.id} status={row.original.status} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ getValue }) => (
        <span className="text-xs text-[var(--color-charcoal-400)]">
          {new Date(getValue() as string).toLocaleDateString("en-AE")}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original.id)}
          className="p-1.5 rounded-md text-[var(--color-charcoal-400)] hover:text-red-400 hover:bg-red-900/20"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <DataTable
      data={enquiries}
      columns={columns}
      searchPlaceholder="Search enquiries..."
      searchKeys={["name", "email", "phone"]}
    />
  );
}
