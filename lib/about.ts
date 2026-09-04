import { aboutSchema, type AboutFormData } from "@/lib/validations";
import { getHomepageSections } from "@/lib/utils";

const DEFAULT_VALUES: AboutFormData["about_values"] = [
  { title: "10+ Years Experience", description: "Over a decade of expertise navigating the UAE property market with consistent results." },
  { title: "1,200+ Properties", description: "An extensive portfolio spanning Dubai Marina, Downtown, Palm Jumeirah, and beyond." },
  { title: "Expert Agent Team", description: "Multilingual professionals dedicated to finding your perfect property match." },
  { title: "Top Investment Returns", description: "We identify high-yield opportunities and guide you to maximum investment returns." },
  { title: "Transparent Transactions", description: "Full transparency throughout the process — no hidden fees, no surprises." },
  { title: "End-to-End Support", description: "From property search to handover, we are with you at every step." },
];

export async function getAboutContent(): Promise<AboutFormData> {
  const sections = await getHomepageSections("about_");

  let values = DEFAULT_VALUES;
  if (sections.about_values) {
    try {
      const parsed = JSON.parse(sections.about_values);
      if (Array.isArray(parsed) && parsed.length === 6) {
        values = parsed;
      }
    } catch {
      // use defaults
    }
  }

  return {
    about_title: sections.about_title || "About Pearl Gate Elite",
    about_subtitle: sections.about_subtitle || "",
    about_story: sections.about_story || "",
    about_mission: sections.about_mission || "",
    about_vision: sections.about_vision || "",
    about_values: values,
    about_seo_title: sections.about_seo_title || "",
    about_seo_description: sections.about_seo_description || "",
  };
}

export function serializeAboutContent(data: AboutFormData): Record<string, string> {
  return {
    about_title: data.about_title,
    about_subtitle: data.about_subtitle ?? "",
    about_story: data.about_story ?? "",
    about_mission: data.about_mission ?? "",
    about_vision: data.about_vision ?? "",
    about_values: JSON.stringify(data.about_values),
    about_seo_title: data.about_seo_title ?? "",
    about_seo_description: data.about_seo_description ?? "",
  };
}

export { aboutSchema };
