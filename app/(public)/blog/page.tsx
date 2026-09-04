import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { readingTime } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description: "Stay up to date with UAE real estate news, market insights, and property guides.",
};

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  const featured = articles.filter((a) => a.featured).slice(0, 1)[0];
  const rest = articles.filter((a) => !featured || a.id !== featured.id);

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-900)] pt-20">
      <div className="bg-[var(--color-charcoal-900)] py-14">
        <div className="container-site">
          <span className="text-label text-[var(--color-brand-400)] block mb-2">Market Insights</span>
          <h1 className="heading-section text-white text-3xl lg:text-4xl">Blog & Articles</h1>
          <p className="text-[var(--color-charcoal-400)] mt-3 max-w-lg">
            Stay informed with the latest UAE real estate news, market trends, and property investment guides.
          </p>
        </div>
      </div>

      <div className="container-site py-12">
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-charcoal-800)] rounded-2xl">
            <p className="text-[var(--color-charcoal-400)]">No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group block mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-[var(--color-charcoal-800)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={featured.coverImageUrl || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80"}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 badge-featured">Featured</span>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <p className="text-xs text-[var(--color-charcoal-400)] mb-3">
                      {new Date(featured.publishedAt || featured.createdAt).toLocaleDateString("en-AE", { year: "numeric", month: "long", day: "numeric" })}
                      {" · "}
                      <span className="inline-flex items-center gap-1"><Clock size={10} /> {readingTime(featured.content)} min read</span>
                    </p>
                    <h2 className="heading-section text-white text-2xl mb-3 group-hover:text-[var(--color-brand-500)] transition-colors">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-sm text-[var(--color-charcoal-300)] line-clamp-3 mb-5">{featured.excerpt}</p>
                    )}
                    <span className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-500)]">
                      Read Article <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Article grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`} className="group card-premium">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.coverImageUrl || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=70"}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-[var(--color-charcoal-400)] mb-3">
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString("en-AE", { year: "numeric", month: "long", day: "numeric" })}
                      {" · "}{readingTime(article.content)} min read
                    </p>
                    <h3 className="font-semibold text-white text-base mb-2 group-hover:text-[var(--color-brand-500)] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-xs text-[var(--color-charcoal-400)] line-clamp-2 mb-3">{article.excerpt}</p>
                    )}
                    <span className="flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-500)]">
                      Read More <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
