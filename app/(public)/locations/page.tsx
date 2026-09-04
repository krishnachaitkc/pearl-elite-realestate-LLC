import { prisma } from "@/lib/db";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Locations",
  description: "Explore premium property locations across Dubai and the UAE.",
};

const fallbackImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=70",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=70",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=70",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=70",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=70",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=70",
];

export default async function LocationsPage() {
  const locations = await prisma.location.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { _count: { select: { properties: { where: { published: true } } } } },
  });

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-900)] pt-20">
      <div className="bg-[var(--color-charcoal-900)] py-14">
        <div className="container-site">
          <span className="text-label text-[var(--color-brand-400)] block mb-2">Explore Dubai</span>
          <h1 className="heading-section text-white text-3xl lg:text-4xl">Popular Locations</h1>
        </div>
      </div>

      <div className="container-site py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <Link key={location.id} href={`/locations/${location.slug}`}
              className="group card-premium overflow-hidden">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={location.imageUrl || fallbackImages[index % fallbackImages.length]}
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-1 text-xs text-white/70 mb-1">
                    <MapPin size={10} /><span>Dubai, UAE</span>
                  </div>
                  <h3 className="font-semibold text-white text-lg group-hover:text-[var(--color-brand-200)] transition-colors">
                    {location.name}
                  </h3>
                  <p className="text-xs text-white/60 mt-0.5">{location._count.properties} Properties</p>
                </div>
              </div>
              {location.description && (
                <div className="p-4">
                  <p className="text-xs text-[var(--color-charcoal-400)] line-clamp-2">{location.description}</p>
                  <div className="flex items-center gap-1 text-xs text-[var(--color-brand-500)] mt-3 font-medium">
                    View Properties <ArrowRight size={11} />
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
