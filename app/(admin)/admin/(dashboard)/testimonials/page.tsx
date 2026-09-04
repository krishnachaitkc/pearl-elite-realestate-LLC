import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import SimpleList from "@/components/admin/SimpleList";

export const metadata: Metadata = { title: "Testimonials" };
export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">{testimonials.length} testimonials</p>
        </div>
        <Link href="/admin/testimonials/new" className="btn-primary"><Plus className="w-4 h-4" /> Add Testimonial</Link>
      </div>
      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6">
        <SimpleList
          items={testimonials.map((t) => ({
            id: t.id,
            name: t.name,
            subtitle: t.role ?? undefined,
            published: t.published,
            editHref: `/admin/testimonials/${t.id}/edit`,
            deleteApi: `/api/admin/testimonials/${t.id}`,
          }))}
          searchPlaceholder="Search testimonials..."
        />
      </div>
    </div>
  );
}
