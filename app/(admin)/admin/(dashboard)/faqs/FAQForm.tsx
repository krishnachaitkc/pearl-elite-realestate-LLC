"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { faqSchema, type FAQFormData } from "@/lib/validations";
import { Loader2 } from "lucide-react";

type Props = { initialData?: Partial<FAQFormData> & { id?: string } };

export default function FAQForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema) as never,
    defaultValues: {
      question: initialData?.question ?? "",
      answer: initialData?.answer ?? "",
      category: initialData?.category ?? "",
      order: initialData?.order ?? 0,
      published: initialData?.published ?? true,
    },
  });

  const onSubmit = async (data: FAQFormData) => {
    setError(null);
    const url = isEdit ? `/api/admin/faqs/${initialData!.id}` : "/api/admin/faqs";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { setError("Failed to save"); return; }
    router.push("/admin/faqs");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {error && <div className="p-3 bg-red-900/20 text-red-400 text-sm rounded-lg">{error}</div>}
      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase">Question *</label>
          <input {...register("question")} className="input-base" />
          {errors.question && <p className="text-xs text-red-400 mt-1">{errors.question.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase">Answer *</label>
          <textarea {...register("answer")} rows={5} className="input-base resize-y" />
          {errors.answer && <p className="text-xs text-red-400 mt-1">{errors.answer.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase">Category</label>
          <input {...register("category")} className="input-base" placeholder="Buying, Renting, etc." />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("published")} className="w-4 h-4 accent-[var(--color-brand-500)]" />
          <span className="text-sm font-medium">Published</span>
        </label>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? "Update" : "Create"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}
