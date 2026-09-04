"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { aboutSchema, type AboutFormData } from "@/lib/validations";
import { Loader2, CheckCircle } from "lucide-react";

type Props = {
  content: AboutFormData;
};

export default function AboutForm({ content }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema) as never,
    defaultValues: content,
  });

  const { fields } = useFieldArray({ control, name: "about_values" });

  const onSubmit = async (data: AboutFormData) => {
    setError(null);
    setSaved(false);
    const res = await fetch("/api/admin/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      setError("Failed to save About Us content");
      return;
    }
    setSaved(true);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {error && <div className="p-3 bg-red-900/20 text-red-400 text-sm rounded-lg">{error}</div>}
      {saved && (
        <div className="p-3 bg-emerald-900/20 text-emerald-400 text-sm rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> About Us content saved successfully
        </div>
      )}

      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-4">
        <h2 className="font-semibold text-white">Page Header</h2>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Title *</label>
          <input {...register("about_title")} className="input-base" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Subtitle</label>
          <input {...register("about_subtitle")} className="input-base" />
        </div>
      </div>

      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-4">
        <h2 className="font-semibold text-white">Our Story</h2>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Story</label>
          <textarea {...register("about_story")} rows={8} className="input-base resize-y" />
          <p className="text-xs text-[var(--color-charcoal-400)] mt-1">Use blank lines to separate paragraphs.</p>
        </div>
      </div>

      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-4">
        <h2 className="font-semibold text-white">Mission & Vision</h2>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Mission</label>
          <textarea {...register("about_mission")} rows={3} className="input-base resize-y" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Vision</label>
          <textarea {...register("about_vision")} rows={3} className="input-base resize-y" />
        </div>
      </div>

      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-4">
        <h2 className="font-semibold text-white">Core Values</h2>
        <p className="text-sm text-[var(--color-charcoal-400)]">Six value cards displayed on the About Us page.</p>
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 rounded-lg border border-white/10 space-y-3">
            <p className="text-xs font-semibold text-[var(--color-brand-400)] uppercase">Value {index + 1}</p>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Title</label>
              <input {...register(`about_values.${index}.title`)} className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Description</label>
              <textarea {...register(`about_values.${index}.description`)} rows={2} className="input-base resize-y" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-4">
        <h2 className="font-semibold text-white">SEO</h2>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">SEO Title</label>
          <input {...register("about_seo_title")} className="input-base" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">SEO Description</label>
          <textarea {...register("about_seo_description")} rows={2} className="input-base resize-y" />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Save About Us
      </button>
    </form>
  );
}
