import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import SimpleList from "@/components/admin/SimpleList";

export const metadata: Metadata = { title: "Communities" };
export const dynamic = "force-dynamic";

export default async function AdminCommunitiesPage() {
  const communities = await prisma.community.findMany({
    orderBy: { order: "asc" },
    include: { location: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Communities</h1>
          <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">{communities.length} communities</p>
        </div>
        <Link href="/admin/communities/new" className="btn-primary"><Plus className="w-4 h-4" /> Add Community</Link>
      </div>
      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6">
        <SimpleList
          items={communities.map((c) => ({
            id: c.id,
            name: c.name,
            subtitle: c.location?.name ?? undefined,
            published: c.published,
            editHref: `/admin/communities/${c.id}/edit`,
            deleteApi: `/api/admin/communities/${c.id}`,
          }))}
          searchPlaceholder="Search communities..."
        />
      </div>
    </div>
  );
}
