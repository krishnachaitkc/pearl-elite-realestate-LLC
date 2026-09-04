"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsFormData } from "@/lib/validations";
import { Loader2, CheckCircle } from "lucide-react";

type Props = {
  settings: SettingsFormData;
};

export default function SettingsForm({ settings }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema) as never,
    defaultValues: settings,
  });

  const onSubmit = async (data: SettingsFormData) => {
    setError(null);
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      setError("Failed to save settings");
      return;
    }
    setSaved(true);
    router.refresh();
  };

  const sections = [
    {
      title: "General",
      fields: [
        { key: "company_name", label: "Company Name" },
        { key: "company_tagline", label: "Tagline" },
        { key: "business_hours", label: "Business Hours" },
      ],
    },
    {
      title: "Contact",
      fields: [
        { key: "phone_primary", label: "Primary Phone" },
        { key: "phone_secondary", label: "Secondary Phone" },
        { key: "whatsapp_number", label: "WhatsApp Number" },
        { key: "email_primary", label: "Primary Email" },
        { key: "email_enquiries", label: "Enquiries Email" },
        { key: "address", label: "Address" },
      ],
    },
    {
      title: "Social Media",
      fields: [
        { key: "social_facebook", label: "Facebook URL" },
        { key: "social_instagram", label: "Instagram URL" },
        { key: "social_twitter", label: "Twitter/X URL" },
        { key: "social_linkedin", label: "LinkedIn URL" },
        { key: "social_youtube", label: "YouTube URL" },
      ],
    },
    {
      title: "SEO",
      fields: [
        { key: "seo_default_title", label: "Default SEO Title" },
        { key: "seo_default_description", label: "Default SEO Description" },
      ],
    },
  ] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {error && <div className="p-3 bg-red-900/20 text-red-400 text-sm rounded-lg">{error}</div>}
      {saved && (
        <div className="p-3 bg-emerald-900/20 text-emerald-400 text-sm rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Settings saved successfully
        </div>
      )}

      {sections.map((section) => (
        <div key={section.title} className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-4">
          <h2 className="font-semibold text-white">{section.title}</h2>
          {section.fields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase">{label}</label>
              <input {...register(key)} className="input-base" />
            </div>
          ))}
        </div>
      ))}

      <button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Save Settings
      </button>
    </form>
  );
}
