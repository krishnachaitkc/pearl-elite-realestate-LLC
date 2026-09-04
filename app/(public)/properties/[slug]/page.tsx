import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatPrice, formatArea } from "@/lib/utils";
import { buildWhatsAppUrl, propertyWhatsAppMessage } from "@/lib/whatsapp";
import PropertyGallery from "@/components/properties/PropertyGallery";
import EnquiryForm from "@/components/properties/EnquiryForm";
import { PropertyCard } from "@/components/home/FeaturedProperties";
import {
  Bed, Bath, Square, MapPin, Phone, Calendar,
  Tag, Building2, Home, FileText, Shield, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug },
    select: { title: true, seoTitle: true, seoDescription: true, description: true },
  });
  if (!property) return { title: "Property Not Found" };
  return {
    title: property.seoTitle || property.title,
    description: property.seoDescription || property.description.slice(0, 160),
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;

  const property = await prisma.property.findUnique({
    where: { slug, published: true },
    include: {
      images: { orderBy: { order: "asc" } },
      location: true,
      community: true,
      developer: true,
      agent: true,
      amenities: { include: { amenity: true } },
    },
  });

  if (!property) notFound();

  // Similar properties
  const similar = await prisma.property.findMany({
    where: {
      published: true,
      priceType: property.priceType,
      propertyType: property.propertyType,
      id: { not: property.id },
    },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      location: { select: { name: true } },
      community: { select: { name: true } },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  // Increment view count (fire-and-forget)
  prisma.property.update({ where: { id: property.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  const agentWhatsApp = property.agent?.whatsapp || "971545005113";
  const waMessage = propertyWhatsAppMessage(property.title, property.referenceNo, property.agent?.name);
  const waUrl = buildWhatsAppUrl(agentWhatsApp, waMessage);

  const locationName = property.community?.name || property.location?.name;

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-900)] pt-20">
      {/* Breadcrumb */}
      <div className="bg-[var(--color-charcoal-800)] border-b border-white/10">
        <div className="container-site py-3 flex items-center gap-2 text-xs text-[var(--color-charcoal-400)]">
          <Link href="/" className="hover:text-[var(--color-brand-500)]">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-[var(--color-brand-500)]">Properties</Link>
          {locationName && (
            <>
              <span>/</span>
              <span>{locationName}</span>
            </>
          )}
          <span>/</span>
          <span className="text-white/90 truncate max-w-[200px]">{property.title}</span>
        </div>
      </div>

      <div className="container-site py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <PropertyGallery images={property.images} title={property.title} />

            {/* Title & Price */}
            <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-3">
                
                {property.status === "OFF_PLAN" && <span className="badge-off-plan">Off-Plan</span>}
                {property.featured && <span className="badge-featured">Featured</span>}
              </div>

              <h1 className="heading-section text-white text-2xl lg:text-3xl mb-2">
                {property.title}
              </h1>

              {locationName && (
                <div className="flex items-center gap-1.5 text-sm text-[var(--color-charcoal-400)] mb-4">
                  <MapPin size={14} className="text-[var(--color-brand-500)]" />
                  {locationName}{property.location && property.community ? `, ${property.location.name}` : ""}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-3xl font-bold text-[var(--color-brand-600)]">
                    {formatPrice(property.price as unknown as number)}
                    {property.priceType === "RENT" && (
                      <span className="text-sm font-normal text-[var(--color-charcoal-400)] ml-1">/year</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-[var(--color-charcoal-300)]">
                  {property.bedrooms !== null && (
                    <span className="flex items-center gap-1.5">
                      <Bed size={16} className="text-[var(--color-charcoal-400)]" />
                      <strong>{property.bedrooms}</strong> Beds
                    </span>
                  )}
                  {property.bathrooms !== null && (
                    <span className="flex items-center gap-1.5">
                      <Bath size={16} className="text-[var(--color-charcoal-400)]" />
                      <strong>{property.bathrooms}</strong> Baths
                    </span>
                  )}
                  {property.area && (
                    <span className="flex items-center gap-1.5">
                      <Square size={16} className="text-[var(--color-charcoal-400)]" />
                      <strong>{formatArea(property.area as unknown as number)}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Key details */}
            <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-white text-lg mb-5">Property Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: Tag, label: "Reference", value: property.referenceNo },
                  { icon: Home, label: "Type", value: property.propertyType.charAt(0) + property.propertyType.slice(1).toLowerCase() },
                  { icon: Building2, label: "Status", value: property.status === "READY" ? "Ready to Move" : "Off-Plan" },
                  ...(property.furnished ? [{ icon: Shield, label: "Furnished", value: property.furnished.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) }] : []),
                  ...(property.completionDate ? [{ icon: Calendar, label: "Completion", value: new Date(property.completionDate).toLocaleDateString("en-AE", { month: "short", year: "numeric" }) }] : []),
                  ...(property.developer ? [{ icon: Building2, label: "Developer", value: property.developer.name }] : []),
                ].map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div key={detail.label} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-charcoal-900)]">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-100)] flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-[var(--color-brand-600)]" />
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-charcoal-400)]">{detail.label}</p>
                        <p className="text-sm font-medium text-white">{detail.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-white text-lg mb-4">Description</h2>
              <div className="text-sm text-[var(--color-charcoal-300)] leading-relaxed whitespace-pre-line">
                {property.description}
              </div>
              {property.paymentPlan && (
                <div className="mt-5 p-4 bg-[var(--color-charcoal-900)] rounded-xl">
                  <h3 className="font-semibold text-sm text-white mb-2 flex items-center gap-2">
                    <FileText size={14} className="text-[var(--color-brand-500)]" />
                    Payment Plan
                  </h3>
                  <p className="text-sm text-[var(--color-charcoal-300)] whitespace-pre-line">{property.paymentPlan}</p>
                </div>
              )}
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-white text-lg mb-4">Amenities & Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map(({ amenity }) => (
                    <div key={amenity.id} className="flex items-center gap-2 text-sm text-[var(--color-charcoal-300)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-500)] shrink-0" />
                      {amenity.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Floor plan */}
            {property.floorPlanUrl && (
              <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-white text-lg mb-4">Floor Plan</h2>
                <img src={property.floorPlanUrl} alt="Floor Plan" className="w-full rounded-xl" />
              </div>
            )}

            {/* Map */}
            {property.latitude && property.longitude && (
              <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-white text-lg mb-4">Location</h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-[var(--color-charcoal-100)]">
                  <iframe
                    src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: sidebar */}
          <div className="space-y-5">
            {/* Agent card */}
            {property.agent && (
              <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-5 shadow-sm sticky top-24">
                <p className="text-xs font-semibold text-[var(--color-charcoal-400)] uppercase tracking-wider mb-4">Listed By</p>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-[var(--color-brand-100)] shrink-0">
                    {property.agent.photoUrl ? (
                      <img src={property.agent.photoUrl} alt={property.agent.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-brand-500)] font-bold text-lg">
                        {property.agent.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{property.agent.name}</p>
                    {property.agent.designation && (
                      <p className="text-xs text-[var(--color-brand-500)]">{property.agent.designation}</p>
                    )}
                    {property.agent.languages.length > 0 && (
                      <p className="text-xs text-[var(--color-charcoal-400)] mt-0.5">{property.agent.languages.join(", ")}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {property.agent.phone && (
                    <a href={`tel:${property.agent.phone}`} className="btn-secondary w-full justify-center gap-2">
                      <Phone size={15} />
                      Call Agent
                    </a>
                  )}
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full justify-center">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp Agent
                  </a>
                  <Link href={`/agents/${property.agent.slug}`} className="text-xs text-center block text-[var(--color-charcoal-400)] hover:text-[var(--color-brand-500)] mt-1">
                    View Agent Profile →
                  </Link>
                </div>
              </div>
            )}

            {/* Enquiry Form */}
            <EnquiryForm propertyId={property.id} agentId={property.agent?.id} />
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="heading-section text-white text-2xl mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((p) => <PropertyCard key={p.id} property={p as any} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
