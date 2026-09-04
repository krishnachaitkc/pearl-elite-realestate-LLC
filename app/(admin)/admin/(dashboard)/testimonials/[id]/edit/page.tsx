import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import TestimonialForm from "../../TestimonialForm";

export const metadata: Metadata = { title: "Edit Testimonial" };

interface Props { params: Promise<{ id: string }> }

export default async function EditTestimonialPage({ params }: Props) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Testimonial</h1>
      <TestimonialForm
        initialData={{
          id: testimonial.id,
          name: testimonial.name,
          role: testimonial.role,
          content: testimonial.content,
          rating: testimonial.rating,
          photoUrl: testimonial.photoUrl ?? "",
          featured: testimonial.featured,
          published: testimonial.published,
          order: testimonial.order,
        }}
      />
    </div>
  );
}
