"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationSchema, type LocationFormData } from "@/lib/validations";
import { Loader2 } from "lucide-react";

type Props = {
  initialData?: Partial<LocationFormData> & { id?: string };
};

export default function LocationForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<string[]>(initialData?.highlights ?? []);
  const [highlightInput, setHighlightInput] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema) as never,
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      latitude: initialData?.latitude ?? null,
      longitude: initialData?.longitude ?? null,
      highlights: initialData?.highlights ?? [],
      published: initialData?.published ?? true,
      order: initialData?.order ?? 0,
      seoTitle: initialData?.seoTitle ?? "",
      seoDescription: initialData?.seoDescription ?? "",
    },
  });

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput("");
    }
  };

  const onSubmit = async (data: LocationFormData) => {
    setError(null);
    const payload = { ...data, highlights };
    const url = isEdit ? `/api/admin/locations/${initialData!.id}` : "/api/admin/locations";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setError("Failed to save location");
      return;
    }
    router.push("/admin/locations");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {error && <div className="p-3 bg-red-900/20 text-red-400 text-sm rounded-lg">{error}</div>}

      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Name *</label>
          <input {...register("name")} className="input-base" />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Description</label>
          <textarea {...register("description")} rows={4} className="input-base resize-y" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Image URL</label>
          <input {...register("imageUrl")} type="url" className="input-base" placeholder="https://..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Order</label>
            <input {...register("order")} type="number" className="input-base" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("published")} className="w-4 h-4 accent-[var(--color-brand-500)]" />
              <span className="text-sm font-medium">Published</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Highlights</label>
          <div className="flex gap-2 mb-2">
            <input
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              className="input-base"
              placeholder="Add a highlight..."
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
            />
            <button type="button" onClick={addHighlight} className="btn-secondary shrink-0">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {highlights.map((h, i) => (
              <span key={i} className="text-xs bg-[var(--color-brand-50)] text-[var(--color-brand-700)] px-2 py-1 rounded-full flex items-center gap-1">
                {h}
                <button type="button" onClick={() => setHighlights(highlights.filter((_, j) => j !== i))} className="hover:text-red-400">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? "Update Location" : "Create Location"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}
