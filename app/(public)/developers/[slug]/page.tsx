import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Building2, ArrowRight, ExternalLink } from "lucide-react";
import { PropertyCard } from "@/components/home/FeaturedProperties";
import Link from "next/link";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const developer = await prisma.developer.findUnique({
    where: { slug },
    select: { name: true, seoTitle: true, seoDescription: true },
  });
  if (!developer) return { title: "Developer Not Found" };
  return {
    title: developer.seoTitle || `${developer.name} Properties`,
    description: developer.seoDescription || undefined,
  };
}

export default async function DeveloperDetailPage({ params }: Props) {
  const { slug } = await params;
  const developer = await prisma.developer.findUnique({
    where: { slug, published: true },
    include: {
      properties: {
        where: { published: true },
        include: {
          images: { orderBy: { order: "asc" }, take: 1 },
          location: { select: { name: true } },
          community: { select: { name: true } },
        },
        take: 6,
      },
    },
  });
  if (!developer) notFound();

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-900)] pt-20">
      <div className="bg-[var(--color-charcoal-900)] py-14">
        <div className="container-site">
          <div className="flex items-center gap-5">
            {developer.logoUrl ? (
              <img
                src={developer.logoUrl}
                alt={developer.name}
                className="w-20 h-20 object-contain rounded-xl bg-[var(--color-charcoal-800)] p-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-[var(--color-brand-500)] flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <span className="text-label text-[var(--color-brand-400)] block mb-1">Developer</span>
              <h1 className="heading-section text-white text-3xl lg:text-4xl">{developer.name}</h1>
              <p className="text-[var(--color-charcoal-400)] text-sm mt-1">
                {developer.properties.length} Properties Available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-site py-10 space-y-10">
        {developer.description && (
          <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg text-white mb-3">About {developer.name}</h2>
            <p className="text-sm text-[var(--color-charcoal-300)] leading-relaxed">{developer.description}</p>
            {developer.website && (
              <a
                href={developer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[var(--color-brand-500)] hover:text-[var(--color-brand-600)]"
              >
                Visit Website <ExternalLink size={14} />
              </a>
            )}
          </div>
        )}

        {developer.properties.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-semibold text-xl text-white">
                Properties by {developer.name}
              </h2>
              <Link
                href={`/properties?developer=${encodeURIComponent(developer.name)}`}
                className="flex items-center gap-1 text-sm text-[var(--color-brand-500)] hover:text-[var(--color-brand-600)]"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {developer.properties.map((p) => <PropertyCard key={p.id} property={p as never} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
