import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import SimpleList from "@/components/admin/SimpleList";

export const metadata: Metadata = { title: "FAQs" };
export const dynamic = "force-dynamic";

export default async function AdminFAQsPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">FAQs</h1>
          <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">{faqs.length} questions</p>
        </div>
        <Link href="/admin/faqs/new" className="btn-primary"><Plus className="w-4 h-4" /> Add FAQ</Link>
      </div>
      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6">
        <SimpleList
          items={faqs.map((f) => ({
            id: f.id,
            name: f.question,
            subtitle: f.category ?? undefined,
            published: f.published,
            editHref: `/admin/faqs/${f.id}/edit`,
            deleteApi: `/api/admin/faqs/${f.id}`,
          }))}
          searchPlaceholder="Search FAQs..."
        />
      </div>
    </div>
  );
}
