import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import DeveloperForm from "../../DeveloperForm";

export const metadata: Metadata = { title: "Edit Developer" };

interface Props { params: Promise<{ id: string }> }

export default async function EditDeveloperPage({ params }: Props) {
  const { id } = await params;
  const developer = await prisma.developer.findUnique({ where: { id } });
  if (!developer) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Developer</h1>
      <DeveloperForm
        initialData={{
          id: developer.id,
          name: developer.name,
          description: developer.description,
          logoUrl: developer.logoUrl ?? "",
          website: developer.website ?? "",
          featured: developer.featured,
          published: developer.published,
        }}
      />
    </div>
  );
}
