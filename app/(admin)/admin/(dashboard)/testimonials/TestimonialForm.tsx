"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testimonialSchema, type TestimonialFormData } from "@/lib/validations";
import { Loader2 } from "lucide-react";

type Props = { initialData?: Partial<TestimonialFormData> & { id?: string } };

export default function TestimonialForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema) as never,
    defaultValues: {
      name: initialData?.name ?? "",
      role: initialData?.role ?? "",
      content: initialData?.content ?? "",
      rating: initialData?.rating ?? 5,
      photoUrl: initialData?.photoUrl ?? "",
      featured: initialData?.featured ?? false,
      published: initialData?.published ?? true,
      order: initialData?.order ?? 0,
    },
  });

  const onSubmit = async (data: TestimonialFormData) => {
    setError(null);
    const url = isEdit ? `/api/admin/testimonials/${initialData!.id}` : "/api/admin/testimonials";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { setError("Failed to save"); return; }
    router.push("/admin/testimonials");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {error && <div className="p-3 bg-red-900/20 text-red-400 text-sm rounded-lg">{error}</div>}
      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase">Name *</label>
            <input {...register("name")} className="input-base" />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase">Role</label>
            <input {...register("role")} className="input-base" placeholder="Property Buyer" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase">Content *</label>
          <textarea {...register("content")} rows={4} className="input-base resize-y" />
          {errors.content && <p className="text-xs text-red-400 mt-1">{errors.content.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase">Rating (1-5)</label>
          <input {...register("rating")} type="number" min="1" max="5" className="input-base w-24" />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-[var(--color-brand-500)]" />
            <span className="text-sm font-medium">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("published")} className="w-4 h-4 accent-[var(--color-brand-500)]" />
            <span className="text-sm font-medium">Published</span>
          </label>
        </div>
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
