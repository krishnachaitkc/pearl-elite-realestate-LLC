import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import SimpleList from "@/components/admin/SimpleList";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Articles</h1>
          <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">{articles.length} articles</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary"><Plus className="w-4 h-4" /> New Article</Link>
      </div>
      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6">
        <SimpleList
          items={articles.map((a) => ({
            id: a.id,
            name: a.title,
            subtitle: a.published ? "Published" : "Draft",
            published: a.published,
            editHref: `/admin/blog/${a.id}/edit`,
            deleteApi: `/api/admin/articles/${a.id}`,
          }))}
          searchPlaceholder="Search articles..."
        />
      </div>
    </div>
  );
}
