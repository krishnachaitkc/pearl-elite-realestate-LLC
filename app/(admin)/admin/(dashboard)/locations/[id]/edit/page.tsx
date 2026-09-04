import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import LocationForm from "../../LocationForm";

export const metadata: Metadata = { title: "Edit Location" };

interface Props { params: Promise<{ id: string }> }

export default async function EditLocationPage({ params }: Props) {
  const { id } = await params;
  const location = await prisma.location.findUnique({ where: { id } });
  if (!location) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Edit Location</h1>
        <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">{location.name}</p>
      </div>
      <LocationForm
        initialData={{
          id: location.id,
          name: location.name,
          description: location.description,
          imageUrl: location.imageUrl ?? "",
          latitude: location.latitude ? Number(location.latitude) : null,
          longitude: location.longitude ? Number(location.longitude) : null,
          highlights: location.highlights,
          published: location.published,
          order: location.order,
          seoTitle: location.seoTitle ?? "",
          seoDescription: location.seoDescription ?? "",
        }}
      />
    </div>
  );
}
