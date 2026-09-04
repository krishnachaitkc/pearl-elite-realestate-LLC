import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

interface Location {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  _count?: { properties: number };
}

interface LocationsSectionProps {
  locations: Location[];
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=70",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=70",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=70",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&q=70",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=70",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=70",
];

export default function LocationsSection({ locations }: LocationsSectionProps) {
  const displayed = locations.slice(0, 6);

  return (
    <section className="section-padding bg-[var(--color-charcoal-800)]">
      <div className="container-site">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-label text-[var(--color-brand-500)] block mb-3">
              Explore Dubai
            </span>
            <h2 className="heading-section text-white text-3xl lg:text-4xl">
              Popular Locations
            </h2>
            <span className="divider-gold-left mt-3" />
          </div>
          <Link
            href="/locations"
            className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-500)] hover:text-[var(--color-brand-600)] transition-colors shrink-0"
          >
            All Locations
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {displayed.map((location, index) => (
            <Link
              key={location.id}
              href={`/locations/${location.slug}`}
              className={`group relative overflow-hidden rounded-xl ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
              style={{ minHeight: index === 0 ? "320px" : "180px" }}
            >
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src={
                    location.imageUrl || fallbackImages[index % fallbackImages.length]
                  }
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-1.5 text-xs text-white/70 mb-1">
                  <MapPin size={11} />
                  <span>Dubai, UAE</span>
                </div>
                <h3 className={`font-semibold text-white heading-section group-hover:text-[var(--color-brand-200)] transition-colors ${index === 0 ? "text-2xl" : "text-base"}`}>
                  {location.name}
                </h3>
                {location._count && (
                  <p className="text-xs text-white/60 mt-1">
                    {location._count.properties} Properties
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
