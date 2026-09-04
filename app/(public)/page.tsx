import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/utils";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import StatsSection from "@/components/home/StatsSection";
import LocationsSection from "@/components/home/LocationsSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import AgentsSection from "@/components/home/AgentsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ArticlesSection from "@/components/home/ArticlesSection";
import EnquiryCTA from "@/components/home/EnquiryCTA";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.seo_default_title || "Pearl Gate Elite Real Estate | Premium UAE Properties",
    description: settings.seo_default_description,
    openGraph: {
      title: settings.seo_default_title,
      description: settings.seo_default_description,
    },
  };
}

export default async function HomePage() {
  // Fetch all data in parallel (server-side, no API round-trips)
  const [settings, homepageSections, featuredProperties, locations, agents, testimonials, articles] =
    await Promise.all([
      getSettings(),
      prisma.homepageSection.findMany(),
      prisma.property.findMany({
        where: { featured: true, published: true },
        include: {
          images: { orderBy: { order: "asc" } },
          location: { select: { name: true } },
          community: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.location.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        take: 6,
        include: { _count: { select: { properties: { where: { published: true } } } } },
      }),
      prisma.agent.findMany({
        where: { active: true, featured: true },
        orderBy: { order: "asc" },
        take: 4,
        include: { _count: { select: { properties: { where: { published: true } } } } },
      }),
      prisma.testimonial.findMany({
        where: { published: true, featured: true },
        orderBy: { order: "asc" },
        take: 3,
      }),
      prisma.article.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
    ]);

  // Build section map
  const sections: Record<string, string> = {};
  homepageSections.forEach((s) => (sections[s.key] = s.value));

  // Build stats from settings
  const stats = [
    { value: sections.stats_transactions || "500+", label: sections.stats_transactions_label || "Successful Transactions" },
    { value: sections.stats_properties || "1,200+", label: sections.stats_properties_label || "Properties Listed" },
    { value: sections.stats_clients || "800+", label: sections.stats_clients_label || "Happy Clients" },
    { value: sections.stats_experience || "10+", label: sections.stats_experience_label || "Years Experience" },
  ];

  return (
    <>
      <HeroSection
        title={sections.hero_title}
        subtitle={sections.hero_subtitle}
        ctaPrimary={sections.hero_cta_primary}
        ctaSecondary={sections.hero_cta_secondary}
      />
      <FeaturedProperties properties={featuredProperties as any} />
      <StatsSection stats={stats} />
      <LocationsSection locations={locations as any} />
      <WhyUsSection
        title={sections.why_us_title}
        subtitle={sections.why_us_subtitle}
      />
      <AgentsSection
        agents={agents as any}
        whatsappNumber={settings.whatsapp_number}
      />
      <TestimonialsSection testimonials={testimonials} />
      <ArticlesSection articles={articles as any} />
      <EnquiryCTA
        title={sections.cta_title}
        subtitle={sections.cta_subtitle}
        phone={settings.phone_primary}
        whatsappNumber={settings.whatsapp_number}
      />
    </>
  );
}
