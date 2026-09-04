import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import LocationsTable from "./LocationsTable";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Locations" };
export const dynamic = "force-dynamic";

export default async function AdminLocationsPage() {
  const locations = await prisma.location.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { properties: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Locations</h1>
          <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">{locations.length} locations</p>
        </div>
        <Link href="/admin/locations/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Location
        </Link>
      </div>
      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6">
        <LocationsTable locations={locations} />
      </div>
    </div>
  );
}
