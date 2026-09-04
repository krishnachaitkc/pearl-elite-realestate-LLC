"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import DataTable, { type ColumnDef } from "@/components/admin/DataTable";
import { Pencil, Trash2 } from "lucide-react";

type Agent = {
  id: string;
  name: string;
  designation: string | null;
  phone: string | null;
  active: boolean;
  featured: boolean;
};

export default function AgentsTable({ agents }: { agents: Agent[] }) {
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete agent "${name}"?`)) return;
    await fetch(`/api/admin/agents/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const columns: ColumnDef<Agent>[] = [
    { accessorKey: "name", header: "Name", cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span> },
    { accessorKey: "designation", header: "Designation", cell: ({ getValue }) => <span className="text-xs">{(getValue() as string) ?? "—"}</span> },
    { accessorKey: "phone", header: "Phone", cell: ({ getValue }) => <span className="text-xs">{(getValue() as string) ?? "—"}</span> },
    {
      accessorKey: "active",
      header: "Active",
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
          <Link href={`/admin/agents/${row.original.id}/edit`} className="p-1.5 rounded-md hover:bg-white/5">
            <Pencil className="w-3.5 h-3.5" />
          </Link>
          <button onClick={() => handleDelete(row.original.id, row.original.name)} className="p-1.5 rounded-md hover:bg-red-900/20 hover:text-red-400">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return <DataTable data={agents} columns={columns} searchPlaceholder="Search agents..." />;
}
