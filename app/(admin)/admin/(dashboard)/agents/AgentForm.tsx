"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agentSchema, type AgentFormData } from "@/lib/validations";
import { Loader2 } from "lucide-react";

type Props = {
  initialData?: Partial<AgentFormData> & { id?: string };
};

export default function AgentForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [error, setError] = useState<string | null>(null);
  const [languages, setLanguages] = useState<string[]>(initialData?.languages ?? []);
  const [langInput, setLangInput] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema) as never,
    defaultValues: {
      name: initialData?.name ?? "",
      designation: initialData?.designation ?? "",
      phone: initialData?.phone ?? "",
      whatsapp: initialData?.whatsapp ?? "",
      email: initialData?.email ?? "",
      bio: initialData?.bio ?? "",
      languages: initialData?.languages ?? [],
      featured: initialData?.featured ?? false,
      active: initialData?.active ?? true,
      order: initialData?.order ?? 0,
    },
  });

  const addLanguage = () => {
    if (langInput.trim() && !languages.includes(langInput.trim())) {
      setLanguages([...languages, langInput.trim()]);
      setLangInput("");
    }
  };

  const onSubmit = async (data: AgentFormData) => {
    setError(null);
    const payload = { ...data, languages };
    const url = isEdit ? `/api/admin/agents/${initialData!.id}` : "/api/admin/agents";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      setError("Failed to save agent");
      return;
    }
    router.push("/admin/agents");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {error && <div className="p-3 bg-red-900/20 text-red-400 text-sm rounded-lg">{error}</div>}

      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Name *</label>
            <input {...register("name")} className="input-base" />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Designation</label>
            <input {...register("designation")} className="input-base" placeholder="Senior Property Consultant" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Phone</label>
            <input {...register("phone")} className="input-base" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">WhatsApp</label>
            <input {...register("whatsapp")} className="input-base" placeholder="971545005113" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Email</label>
            <input {...register("email")} type="email" className="input-base" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Bio</label>
            <textarea {...register("bio")} rows={3} className="input-base resize-y" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">Languages</label>
          <div className="flex gap-2 mb-2">
            <input value={langInput} onChange={(e) => setLangInput(e.target.value)} className="input-base" placeholder="English" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())} />
            <button type="button" onClick={addLanguage} className="btn-secondary shrink-0">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map((l, i) => (
              <span key={i} className="text-xs bg-[var(--color-brand-50)] text-[var(--color-brand-700)] px-2 py-1 rounded-full flex items-center gap-1">
                {l}
                <button type="button" onClick={() => setLanguages(languages.filter((_, j) => j !== i))} className="hover:text-red-400">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-[var(--color-brand-500)]" />
            <span className="text-sm font-medium">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("active")} className="w-4 h-4 accent-[var(--color-brand-500)]" />
            <span className="text-sm font-medium">Active</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? "Update Agent" : "Create Agent"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}
