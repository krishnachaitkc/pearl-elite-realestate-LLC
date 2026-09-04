import Link from "next/link";
import { Phone } from "lucide-react";

interface EnquiryCTAProps {
  title?: string;
  subtitle?: string;
  phone?: string;
  whatsappNumber?: string;
}

export default function EnquiryCTA({
  title = "Ready to Find Your Dream Property?",
  subtitle = "Let our experts guide you to the perfect investment or home in the UAE. Contact us today for a free consultation.",
  phone = "0545005113",
  whatsappNumber = "971545005113",
}: EnquiryCTAProps) {
  const waUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Pearl Gate Elite! I'm looking for a property in UAE and would like your assistance.")}`;

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--color-charcoal-900) 0%, #2d2416 100%)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 border border-white/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 border border-white/5 rounded-full pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-[var(--color-brand-500)]/20 to-transparent pointer-events-none" />

      <div className="container-site relative text-center">
        <span className="text-label text-[var(--color-brand-400)] block mb-4">
          Get Started Today
        </span>
        <h2 className="heading-display text-white text-3xl sm:text-4xl lg:text-5xl mb-5 max-w-2xl mx-auto">
          {title}
        </h2>
        <p className="text-[var(--color-charcoal-400)] text-base max-w-xl mx-auto mb-10 leading-relaxed">
          {subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="btn-primary px-8 py-3.5 text-base">
            Send an Enquiry
          </Link>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp px-8 py-3.5 text-base">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Us
          </a>
          <a
            href={`tel:${phone}`}
            className="btn-outline-white px-8 py-3.5 text-base"
          >
            <Phone size={18} />
            Call Us Now
          </a>
        </div>
      </div>
    </section>
  );
}
