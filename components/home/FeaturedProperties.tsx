import Link from "next/link";
import { Bed, Bath, Square, MapPin, ArrowRight } from "lucide-react";
import { formatPrice, formatArea } from "@/lib/utils";

interface Property {
  id: string;
  slug: string;
  title: string;
  price: number | string;
  priceType: string;
  status: string;
  propertyType: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  featured: boolean;
  location?: { name: string } | null;
  community?: { name: string } | null;
  images: { url: string; isMain: boolean; altText?: string | null }[];
}

interface PropertyCardProps {
  property: Property;
  size?: "default" | "large";
}

export function PropertyCard({ property, size = "default" }: PropertyCardProps) {
  const mainImage =
    property.images.find((img) => img.isMain)?.url ||
    property.images[0]?.url ||
    `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80`;

  const locationName =
    property.community?.name || property.location?.name || "UAE";

  const priceLabel =
    property.priceType === "RENT" ? "/year" : "";

  return (
    <Link href={`/properties/${property.slug}`} className="group block card-premium">
      {/* Image */}
      <div className={`relative overflow-hidden ${size === "large" ? "h-72" : "h-56"}`}>
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          
          {property.status === "OFF_PLAN" && (
            <span className="badge-off-plan">Off-Plan</span>
          )}
          {property.featured && (
            <span className="badge-featured">Featured</span>
          )}
        </div>
        {/* Type badge */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {property.propertyType.charAt(0) + property.propertyType.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-charcoal-400)] mb-2">
          <MapPin size={11} className="text-[var(--color-brand-500)] shrink-0" />
          <span className="truncate">{locationName}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-white text-base mb-3 truncate group-hover:text-[var(--color-brand-500)] transition-colors">
          {property.title}
        </h3>

        {/* Price */}
        <p className="text-[var(--color-brand-600)] font-bold text-lg mb-4">
          {formatPrice(property.price)}
          {priceLabel && (
            <span className="text-xs font-normal text-[var(--color-charcoal-400)] ml-1">
              {priceLabel}
            </span>
          )}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-4 pt-3 border-t border-white/10 text-[var(--color-charcoal-300)] text-xs">
          {property.bedrooms !== null && (
            <span className="flex items-center gap-1.5">
              <Bed size={13} className="text-[var(--color-charcoal-400)]" />
              <span className="font-medium">{property.bedrooms}</span>
              <span className="text-[var(--color-charcoal-400)]">Beds</span>
            </span>
          )}
          {property.bathrooms !== null && (
            <span className="flex items-center gap-1.5">
              <Bath size={13} className="text-[var(--color-charcoal-400)]" />
              <span className="font-medium">{property.bathrooms}</span>
              <span className="text-[var(--color-charcoal-400)]">Baths</span>
            </span>
          )}
          {property.area && (
            <span className="flex items-center gap-1.5 ml-auto">
              <Square size={13} className="text-[var(--color-charcoal-400)]" />
              <span className="font-medium">{formatArea(property.area)}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

interface FeaturedPropertiesProps {
  properties: Property[];
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  return (
    <section className="section-padding bg-[var(--color-charcoal-900)]">
      <div className="container-site">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-label text-[var(--color-brand-500)] block mb-3">
              Hand-picked for you
            </span>
            <h2 className="heading-section text-white text-3xl lg:text-4xl">
              Featured Properties
            </h2>
            <span className="divider-gold-left mt-3" />
          </div>
          <Link
            href="/properties?featured=true"
            className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-500)] hover:text-[var(--color-brand-600)] transition-colors shrink-0"
          >
            View All Properties
            <ArrowRight size={16} />
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-charcoal-400)]">
            <p>No featured properties at the moment.</p>
            <Link href="/properties" className="btn-primary mt-4 inline-flex">
              Browse All Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
