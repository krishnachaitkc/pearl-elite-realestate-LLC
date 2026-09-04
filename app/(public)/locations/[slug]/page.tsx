import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/home/FeaturedProperties";
import Link from "next/link";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loc = await prisma.location.findUnique({ where: { slug }, select: { name: true, seoTitle: true, seoDescription: true } });
  if (!loc) return { title: "Location Not Found" };
  return { title: loc.seoTitle || `${loc.name} Properties`, description: loc.seoDescription || undefined };
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params;
  const location = await prisma.location.findUnique({
    where: { slug, published: true },
    include: {
      communities: { where: { published: true } },
      properties: {
        where: { published: true },
        include: { images: { orderBy: { order: "asc" }, take: 1 }, location: { select: { name: true } }, community: { select: { name: true } } },
        take: 6,
      },
    },
  });
  if (!location) notFound();

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-900)] pt-20">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <img
          src={location.imageUrl || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80"}
          alt={location.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 container-site pb-8">
          <div className="flex items-center gap-1.5 text-xs text-white/70 mb-2">
            <MapPin size={11} /><span>Dubai, UAE</span>
          </div>
          <h1 className="heading-display text-white text-3xl md:text-4xl">{location.name}</h1>
          <p className="text-white/70 text-sm mt-1">{location.properties.length} Properties Available</p>
        </div>
      </div>

      <div className="container-site py-10 space-y-10">
        {/* Description */}
        {location.description && (
          <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg text-white mb-3">About {location.name}</h2>
            <p className="text-sm text-[var(--color-charcoal-300)] leading-relaxed">{location.description}</p>
          </div>
        )}

        {/* Highlights */}
        {location.highlights.length > 0 && (
          <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold text-lg text-white mb-4">Highlights</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {location.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[var(--color-charcoal-300)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-500)] shrink-0" />
                  {h}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Communities */}
        {location.communities.length > 0 && (
          <div>
            <h2 className="font-semibold text-xl text-white mb-4">Communities in {location.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {location.communities.map((c) => (
                <Link key={c.id} href={`/communities/${c.slug}`}
                  className="flex items-center gap-2 p-4 bg-[var(--color-charcoal-800)] rounded-xl shadow-sm hover:border-[var(--color-brand-300)] border border-transparent transition-colors text-sm font-medium text-white/90 hover:text-[var(--color-brand-500)]">
                  <MapPin size={14} className="text-[var(--color-brand-500)]" />
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Properties */}
        {location.properties.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-semibold text-xl text-white">Properties in {location.name}</h2>
              <Link href={`/properties?location=${encodeURIComponent(location.name)}`} className="flex items-center gap-1 text-sm text-[var(--color-brand-500)] hover:text-[var(--color-brand-600)]">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {location.properties.map((p) => <PropertyCard key={p.id} property={p as any} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
