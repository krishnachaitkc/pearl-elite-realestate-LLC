import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import PropertiesTable from "./PropertiesTable";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Properties" };
export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      location: { select: { name: true } },
      agent: { select: { name: true } },
    },
  });

  const serialized = properties.map((p) => ({
    ...p,
    price: p.price.toString(),
    area: p.area?.toString() ?? null,
    latitude: p.latitude?.toString() ?? null,
    longitude: p.longitude?.toString() ?? null,
    completionDate: p.completionDate?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Properties
          </h1>
          <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">
            {properties.length} total properties
          </p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Property
        </Link>
      </div>

      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6">
        <PropertiesTable properties={serialized} />
      </div>
    </div>
  );
}
