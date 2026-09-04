import type { Metadata } from "next";
import Link from "next/link";
import { Award, Target, Eye } from "lucide-react";
import { getAboutContent } from "@/lib/about";
import { getHomepageSections } from "@/lib/utils";
import StatsSection from "@/components/home/StatsSection";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getAboutContent();
  return {
    title: content.about_seo_title || "About Us",
    description: content.about_seo_description || undefined,
  };
}

export default async function AboutPage() {
  const [content, sections] = await Promise.all([
    getAboutContent(),
    getHomepageSections(),
  ]);

  const stats = [
    { value: sections.stats_transactions || "500+", label: sections.stats_transactions_label || "Successful Transactions" },
    { value: sections.stats_properties || "1,200+", label: sections.stats_properties_label || "Properties Listed" },
    { value: sections.stats_clients || "800+", label: sections.stats_clients_label || "Happy Clients" },
    { value: sections.stats_experience || "10+", label: sections.stats_experience_label || "Years Experience" },
  ];

  const storyParagraphs = (content.about_story || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-900)] pt-20">
      {/* Hero */}
      <div className="bg-[var(--color-charcoal-900)] py-14">
        <div className="container-site">
          <span className="text-label text-[var(--color-brand-400)] block mb-2">Who We Are</span>
          <h1 className="heading-section text-white text-3xl lg:text-4xl">{content.about_title}</h1>
          {content.about_subtitle && (
            <p className="text-[var(--color-charcoal-400)] mt-3 max-w-2xl">{content.about_subtitle}</p>
          )}
        </div>
      </div>

      <StatsSection stats={stats} />

      {/* Story */}
      {storyParagraphs.length > 0 && (
        <section className="section-padding">
          <div className="container-site max-w-3xl">
            <span className="text-label text-[var(--color-brand-400)] block mb-3">Our Story</span>
            <h2 className="heading-section text-white text-2xl lg:text-3xl mb-6">Building Trust in UAE Real Estate</h2>
            <div className="space-y-4 text-[var(--color-charcoal-300)] leading-relaxed">
              {storyParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      {(content.about_mission || content.about_vision) && (
        <section className="section-padding bg-[var(--color-charcoal-800)]">
          <div className="container-site">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.about_mission && (
                <div className="p-8 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-500)]/20 flex items-center justify-center mb-4">
                    <Target size={20} className="text-[var(--color-brand-300)]" />
                  </div>
                  <h3 className="font-semibold text-white text-xl mb-3">Our Mission</h3>
                  <p className="text-[var(--color-charcoal-300)] leading-relaxed">{content.about_mission}</p>
                </div>
              )}
              {content.about_vision && (
                <div className="p-8 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-500)]/20 flex items-center justify-center mb-4">
                    <Eye size={20} className="text-[var(--color-brand-300)]" />
                  </div>
                  <h3 className="font-semibold text-white text-xl mb-3">Our Vision</h3>
                  <p className="text-[var(--color-charcoal-300)] leading-relaxed">{content.about_vision}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="section-padding">
        <div className="container-site">
          <div className="max-w-2xl mb-14">
            <span className="text-label text-[var(--color-brand-400)] block mb-3">Our Values</span>
            <h2 className="heading-section text-white text-3xl lg:text-4xl mb-4">Why Clients Choose Us</h2>
            <span className="divider-gold-left" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.about_values.map((item) => (
              <div
                key={item.title}
                className="group p-6 rounded-xl border border-white/10 hover:border-[var(--color-brand-500)]/50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-500)]/20 flex items-center justify-center mb-4">
                  <Award size={20} className="text-[var(--color-brand-300)]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-charcoal-400)] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--color-brand-500)]">
        <div className="container-site text-center">
          <h2 className="heading-section text-white text-2xl lg:text-3xl mb-4">Ready to Work With Us?</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Whether you&apos;re buying, selling, or investing — our team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/properties" className="btn-secondary bg-white text-[var(--color-brand-600)] hover:bg-white/90">
              Browse Properties
            </Link>
            <Link href="/contact" className="btn-secondary border-white text-white hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
