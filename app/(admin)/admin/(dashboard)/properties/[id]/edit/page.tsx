import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PropertyForm from "../../PropertyForm";

export const metadata: Metadata = { title: "Edit Property" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;

  const [property, locations, communities, developers, agents, amenities] =
    await Promise.all([
      prisma.property.findUnique({
        where: { id },
        include: { amenities: { select: { amenityId: true } } },
      }),
      prisma.location.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
      prisma.community.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
      prisma.developer.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
      prisma.agent.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
      prisma.amenity.findMany({ select: { id: true, name: true, category: true }, orderBy: { name: "asc" } }),
    ]);

  if (!property) notFound();

  const initialData = {
    id: property.id,
    title: property.title,
    description: property.description,
    price: Number(property.price),
    priceType: property.priceType,
    status: property.status,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area ? Number(property.area) : null,
    furnished: property.furnished,
    referenceNo: property.referenceNo,
    completionDate: property.completionDate
      ? property.completionDate.toISOString().split("T")[0]
      : null,
    paymentPlan: property.paymentPlan,
    floorPlanUrl: property.floorPlanUrl ?? "",
    videoUrl: property.videoUrl ?? "",
    latitude: property.latitude ? Number(property.latitude) : null,
    longitude: property.longitude ? Number(property.longitude) : null,
    locationId: property.locationId,
    communityId: property.communityId,
    developerId: property.developerId,
    agentId: property.agentId,
    amenityIds: property.amenities.map((a) => a.amenityId),
    featured: property.featured,
    published: property.published,
    seoTitle: property.seoTitle ?? "",
    seoDescription: property.seoDescription ?? "",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Edit Property
        </h1>
        <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">
          {property.title}
        </p>
      </div>
      <PropertyForm
        locations={locations}
        communities={communities}
        developers={developers}
        agents={agents}
        amenities={amenities}
        initialData={initialData}
      />
    </div>
  );
}
