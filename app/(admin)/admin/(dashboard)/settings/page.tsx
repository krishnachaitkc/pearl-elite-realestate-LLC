import type { Metadata } from "next";
import { getSettings } from "@/lib/utils";
import SettingsForm from "./SettingsForm";
import type { SettingsFormData } from "@/lib/validations";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const raw = await getSettings();

  const settings: SettingsFormData = {
    company_name: raw.company_name || "",
    company_tagline: raw.company_tagline || "",
    phone_primary: raw.phone_primary || "",
    phone_secondary: raw.phone_secondary || "",
    whatsapp_number: raw.whatsapp_number || "",
    email_primary: raw.email_primary || "",
    email_enquiries: raw.email_enquiries || "",
    address: raw.address || "",
    social_facebook: raw.social_facebook || "",
    social_instagram: raw.social_instagram || "",
    social_twitter: raw.social_twitter || "",
    social_linkedin: raw.social_linkedin || "",
    social_youtube: raw.social_youtube || "",
    business_hours: raw.business_hours || "",
    seo_default_title: raw.seo_default_title || "",
    seo_default_description: raw.seo_default_description || "",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">
          Manage contact details, social links, and SEO defaults
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
