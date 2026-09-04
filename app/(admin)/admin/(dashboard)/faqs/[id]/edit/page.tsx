import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import FAQForm from "../../FAQForm";

export const metadata: Metadata = { title: "Edit FAQ" };

interface Props { params: Promise<{ id: string }> }

export default async function EditFAQPage({ params }: Props) {
  const { id } = await params;
  const faq = await prisma.fAQ.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit FAQ</h1>
      <FAQForm
        initialData={{
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          order: faq.order,
          published: faq.published,
        }}
      />
    </div>
  );
}
