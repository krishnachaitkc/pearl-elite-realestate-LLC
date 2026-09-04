import { prisma } from "@/lib/db";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developers",
  description: "Explore properties from Dubai's leading real estate developers.",
};

export default async function DevelopersPage() {
  const developers = await prisma.developer.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    include: { _count: { select: { properties: { where: { published: true } } } } },
  });

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-900)] pt-20">
      <div className="bg-[var(--color-charcoal-900)] py-14">
        <div className="container-site">
          <span className="text-label text-[var(--color-brand-400)] block mb-2">Trusted Partners</span>
          <h1 className="heading-section text-white text-3xl lg:text-4xl">Leading Developers</h1>
          <p className="text-[var(--color-charcoal-400)] mt-3 max-w-lg">
            Browse properties from Dubai&apos;s most reputable and trusted real estate developers.
          </p>
        </div>
      </div>

      <div className="container-site py-12">
        {developers.length === 0 ? (
          <div className="text-center py-20 bg-[var(--color-charcoal-800)] rounded-2xl">
            <p className="text-[var(--color-charcoal-400)]">No developers listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((developer) => (
              <Link
                key={developer.id}
                href={`/developers/${developer.slug}`}
                className="group bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-white/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  {developer.logoUrl ? (
                    <img
                      src={developer.logoUrl}
                      alt={developer.name}
                      className="w-14 h-14 object-contain rounded-lg bg-[var(--color-charcoal-800)] p-2"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-[var(--color-brand-50)] flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-[var(--color-brand-500)]" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-[var(--color-brand-500)] transition-colors">
                      {developer.name}
                    </h3>
                    {developer.featured && (
                      <span className="badge-featured mt-1 inline-block">Featured</span>
                    )}
                  </div>
                </div>
                {developer.description && (
                  <p className="text-xs text-[var(--color-charcoal-400)] line-clamp-3 mb-4">
                    {developer.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-charcoal-400)]">
                    {developer._count.properties} Properties
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-500)]">
                    View <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
