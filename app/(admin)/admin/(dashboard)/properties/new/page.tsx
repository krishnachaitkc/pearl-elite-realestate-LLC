import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import PropertyForm from "../PropertyForm";

export const metadata: Metadata = { title: "New Property" };

export default async function NewPropertyPage() {
  const [locations, communities, developers, agents, amenities] = await Promise.all([
    prisma.location.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.community.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.developer.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.agent.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.amenity.findMany({ select: { id: true, name: true, category: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">
          New Property
        </h1>
        <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">
          Create a new property listing
        </p>
      </div>
      <PropertyForm
        locations={locations}
        communities={communities}
        developers={developers}
        agents={agents}
        amenities={amenities}
      />
    </div>
  );
}
