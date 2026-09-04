import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import CommunityForm from "../CommunityForm";

export const metadata: Metadata = { title: "New Community" };

export default async function NewCommunityPage() {
  const locations = await prisma.location.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Community</h1>
      <CommunityForm locations={locations} />
    </div>
  );
}
