import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
}

interface ArticlesSectionProps {
  articles: Article[];
}

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
  const displayed = articles.slice(0, 3);

  if (displayed.length === 0) return null;

  return (
    <section className="section-padding bg-[var(--color-charcoal-900)]">
      <div className="container-site">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-label text-[var(--color-brand-500)] block mb-3">
              Market Insights
            </span>
            <h2 className="heading-section text-white text-3xl lg:text-4xl">
              Latest Articles
            </h2>
            <span className="divider-gold-left mt-3" />
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-500)] hover:text-[var(--color-brand-600)] transition-colors shrink-0"
          >
            All Articles
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {displayed.map((article) => {
            const dateStr = article.publishedAt || article.createdAt;
            return (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group card-premium"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      article.coverImageUrl ||
                      `https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=70`
                    }
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <p className="text-xs text-[var(--color-charcoal-400)] mb-3">
                    {new Date(dateStr).toLocaleDateString("en-AE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h3 className="font-semibold text-white text-base mb-2 group-hover:text-[var(--color-brand-500)] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-sm text-[var(--color-charcoal-400)] line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-500)] mt-4">
                    Read More <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
