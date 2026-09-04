import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import EnquiriesTable from "./EnquiriesTable";

export const metadata: Metadata = { title: "Enquiries" };
export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: { select: { title: true } } },
  });

  const serialized = enquiries.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Enquiries</h1>
        <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">
          {enquiries.length} total leads
        </p>
      </div>
      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6">
        <EnquiriesTable enquiries={serialized} />
      </div>
    </div>
  );
}
