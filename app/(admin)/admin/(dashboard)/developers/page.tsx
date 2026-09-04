import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import SimpleList from "@/components/admin/SimpleList";

export const metadata: Metadata = { title: "Developers" };
export const dynamic = "force-dynamic";

export default async function AdminDevelopersPage() {
  const developers = await prisma.developer.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Developers</h1>
          <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">{developers.length} developers</p>
        </div>
        <Link href="/admin/developers/new" className="btn-primary"><Plus className="w-4 h-4" /> Add Developer</Link>
      </div>
      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6">
        <SimpleList
          items={developers.map((d) => ({
            id: d.id,
            name: d.name,
            published: d.published,
            editHref: `/admin/developers/${d.id}/edit`,
            deleteApi: `/api/admin/developers/${d.id}`,
          }))}
          searchPlaceholder="Search developers..."
        />
      </div>
    </div>
  );
}
