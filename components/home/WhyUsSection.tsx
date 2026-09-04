import { CheckCircle2, TrendingUp, Users, Building2, Award, Clock } from "lucide-react";

const whyUsItems = [
  {
    icon: Award,
    title: "10+ Years Experience",
    description: "Over a decade of expertise navigating the UAE property market with consistent results.",
  },
  {
    icon: Building2,
    title: "1,200+ Properties",
    description: "An extensive portfolio spanning Dubai Marina, Downtown, Palm Jumeirah, and beyond.",
  },
  {
    icon: Users,
    title: "Expert Agent Team",
    description: "Multilingual professionals dedicated to finding your perfect property match.",
  },
  {
    icon: TrendingUp,
    title: "Top Investment Returns",
    description: "We identify high-yield opportunities and guide you to maximum investment returns.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent Transactions",
    description: "Full transparency throughout the process — no hidden fees, no surprises.",
  },
  {
    icon: Clock,
    title: "End-to-End Support",
    description: "From property search to handover, we are with you at every step.",
  },
];

interface WhyUsSectionProps {
  title?: string;
  subtitle?: string;
}

export default function WhyUsSection({
  title = "Why Choose Pearl Gate Elite",
  subtitle = "We combine market expertise with personalised service to deliver exceptional real estate experiences across the UAE.",
}: WhyUsSectionProps) {
  return (
    <section className="section-padding bg-[var(--color-charcoal-900)] text-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-l from-[var(--color-brand-500)] to-transparent" />
      </div>

      <div className="container-site relative">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <span className="text-label text-[var(--color-brand-400)] block mb-3">
            Our Advantage
          </span>
          <h2 className="heading-section text-white text-3xl lg:text-4xl mb-4">
            {title}
          </h2>
          <span className="divider-gold-left" />
          <p className="text-[var(--color-charcoal-300)] mt-4 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {whyUsItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group p-6 rounded-xl border border-white/10 hover:border-[var(--color-brand-500)]/50 hover:bg-[var(--color-charcoal-900)]/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-500)]/20 flex items-center justify-center mb-4 group-hover:bg-[var(--color-brand-500)] transition-colors">
                  <Icon size={20} className="text-[var(--color-brand-300)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-charcoal-400)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
