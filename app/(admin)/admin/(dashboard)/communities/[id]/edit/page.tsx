import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import CommunityForm from "../../CommunityForm";

export const metadata: Metadata = { title: "Edit Community" };

interface Props { params: Promise<{ id: string }> }

export default async function EditCommunityPage({ params }: Props) {
  const { id } = await params;
  const [community, locations] = await Promise.all([
    prisma.community.findUnique({ where: { id } }),
    prisma.location.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!community) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Community</h1>
      <CommunityForm
        locations={locations}
        initialData={{
          id: community.id,
          name: community.name,
          description: community.description,
          imageUrl: community.imageUrl ?? "",
          locationId: community.locationId,
          published: community.published,
          order: community.order,
        }}
      />
    </div>
  );
}
