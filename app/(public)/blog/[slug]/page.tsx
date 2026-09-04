import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { formatDate, readingTime } from "@/lib/utils";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    select: { title: true, seoTitle: true, seoDescription: true, excerpt: true },
  });
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt || undefined,
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug, published: true },
  });
  if (!article) notFound();

  const related = await prisma.article.findMany({
    where: { published: true, NOT: { id: article.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-900)] pt-20">
      {article.coverImageUrl && (
        <div className="relative h-64 md:h-96">
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="container-site py-10 max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-brand-500)] hover:text-[var(--color-brand-600)] mb-6"
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        <header className="mb-8">
          <p className="text-xs text-[var(--color-charcoal-400)] mb-3">
            {formatDate(article.publishedAt || article.createdAt)}
            {" · "}
            <span className="inline-flex items-center gap-1">
              <Clock size={10} /> {readingTime(article.content)} min read
            </span>
          </p>
          <h1 className="heading-display text-white text-3xl md:text-4xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-[var(--color-charcoal-300)] mt-4 text-lg leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </header>

        <article className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 md:p-10 shadow-sm">
          <div
            className="prose prose-sm max-w-none text-[var(--color-charcoal-300)] leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br />") }}
          />
        </article>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-semibold text-lg text-white mb-5">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((a) => (
                <Link key={a.id} href={`/blog/${a.slug}`} className="group card-premium">
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={a.coverImageUrl || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=70"}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-[var(--color-brand-500)] transition-colors">
                      {a.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
