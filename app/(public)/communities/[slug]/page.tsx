import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/home/FeaturedProperties";
import Link from "next/link";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const community = await prisma.community.findUnique({
    where: { slug },
    select: { name: true, seoTitle: true, seoDescription: true },
  });
  if (!community) return { title: "Community Not Found" };
  return {
    title: community.seoTitle || `${community.name} Properties`,
    description: community.seoDescription || undefined,
  };
}

export default async function CommunityDetailPage({ params }: Props) {
  const { slug } = await params;
  const community = await prisma.community.findUnique({
    where: { slug, published: true },
    include: {
      location: { select: { name: true, slug: true } },
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
  if (!community) notFound();

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-900)] pt-20">
      <div className="relative h-64 md:h-80">
        <img
          src={community.imageUrl || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80"}
          alt={community.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 container-site pb-8">
          {community.location && (
            <Link
              href={`/locations/${community.location.slug}`}
              className="flex items-center gap-1.5 text-xs text-white/70 mb-2 hover:text-white transition-colors"
            >
              <MapPin size={11} /><span>{community.location.name}</span>
            </Link>
          )}
          <h1 className="heading-display text-white text-3xl md:text-4xl">{community.name}</h1>
          <p className="text-white/70 text-sm mt-1">{community.properties.length} Properties Available</p>
        </div>
      </div>

      <div className="container-site py-10 space-y-10">
        {community.description && (
          <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg text-white mb-3">About {community.name}</h2>
            <p className="text-sm text-[var(--color-charcoal-300)] leading-relaxed">{community.description}</p>
          </div>
        )}

        {community.highlights.length > 0 && (
          <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg text-white mb-4">Highlights</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {community.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-charcoal-300)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-500)] shrink-0" />
                  {h}
                </div>
              ))}
            </div>
          </div>
        )}

        {community.properties.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-semibold text-xl text-white">
                Properties in {community.name}
              </h2>
              <Link
                href={`/properties?community=${encodeURIComponent(community.name)}`}
                className="flex items-center gap-1 text-sm text-[var(--color-brand-500)] hover:text-[var(--color-brand-600)]"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {community.properties.map((p) => <PropertyCard key={p.id} property={p as never} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
