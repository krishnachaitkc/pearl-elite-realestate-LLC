"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSchema, type ArticleFormData } from "@/lib/validations";
import { Loader2 } from "lucide-react";

type Props = { initialData?: Partial<ArticleFormData> & { id?: string } };

export default function ArticleForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema) as never,
    defaultValues: {
      title: initialData?.title ?? "",
      excerpt: initialData?.excerpt ?? "",
      content: initialData?.content ?? "",
      coverImageUrl: initialData?.coverImageUrl ?? "",
      published: initialData?.published ?? false,
      featured: initialData?.featured ?? false,
    },
  });

  const onSubmit = async (data: ArticleFormData) => {
    setError(null);
    const url = isEdit ? `/api/admin/articles/${initialData!.id}` : "/api/admin/articles";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { setError("Failed to save"); return; }
    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {error && <div className="p-3 bg-red-900/20 text-red-400 text-sm rounded-lg">{error}</div>}
      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase">Title *</label>
          <input {...register("title")} className="input-base" />
          {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase">Excerpt</label>
          <textarea {...register("excerpt")} rows={2} className="input-base resize-y" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase">Content *</label>
          <textarea {...register("content")} rows={12} className="input-base resize-y font-mono text-sm" />
          {errors.content && <p className="text-xs text-red-400 mt-1">{errors.content.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase">Cover Image URL</label>
          <input {...register("coverImageUrl")} type="url" className="input-base" />
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
          {isEdit ? "Update Article" : "Create Article"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}
