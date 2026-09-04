import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ArticleForm from "../../ArticleForm";

export const metadata: Metadata = { title: "Edit Article" };

interface Props { params: Promise<{ id: string }> }

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Article</h1>
      <ArticleForm
        initialData={{
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          coverImageUrl: article.coverImageUrl ?? "",
          published: article.published,
          featured: article.featured,
        }}
      />
    </div>
  );
}
