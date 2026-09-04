import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  photoUrl: string | null;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const displayed = testimonials.slice(0, 3);

  return (
    <section className="section-padding bg-[var(--color-charcoal-800)]">
      <div className="container-site">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-label text-[var(--color-brand-500)] block mb-3">
            Client Stories
          </span>
          <h2 className="heading-section text-white text-3xl lg:text-4xl mb-3">
            What Our Clients Say
          </h2>
          <span className="divider-gold" />
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {displayed.map((t) => (
            <div key={t.id} className="card-premium p-7 bg-[var(--color-charcoal-900)]">
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < t.rating ? "text-[var(--color-brand-400)] fill-current" : "text-[var(--color-charcoal-200)]"}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[var(--color-charcoal-300)] text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[var(--color-brand-100)]">
                  {t.photoUrl ? (
                    <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-brand-500)] font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{t.name}</p>
                  {t.role && (
                    <p className="text-xs text-[var(--color-charcoal-400)]">{t.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
