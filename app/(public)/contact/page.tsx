import { getSettings } from "@/lib/utils";
import { prisma } from "@/lib/db";
import EnquiryForm from "@/components/properties/EnquiryForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Pearl Gate Elite Real Estate. We're here to help you find your perfect property.",
};

export default async function ContactPage() {
  const [settings, offices] = await Promise.all([
    getSettings(),
    prisma.officeLocation.findMany({ where: { published: true }, orderBy: { isPrimary: "desc" } }),
  ]);

  const phone = settings.phone_primary || "0545005113";
  const phoneSec = settings.phone_secondary || "0581718701";
  const email = settings.email_primary || "info@pearlgateelite.com";
  const whatsapp = settings.whatsapp_number || "971545005113";
  const waUrl = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Pearl Gate Elite! I'd like to get in touch.")}`;

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-900)] pt-20">
      {/* Header */}
      <div className="bg-[var(--color-charcoal-900)] py-14">
        <div className="container-site">
          <span className="text-label text-[var(--color-brand-400)] block mb-2">Get in Touch</span>
          <h1 className="heading-section text-white text-3xl lg:text-4xl">Contact Us</h1>
          <p className="text-[var(--color-charcoal-400)] mt-3 max-w-lg">
            Whether you&apos;re buying, selling, or renting — we&apos;re here to guide you every step of the way.
          </p>
        </div>
      </div>

      <div className="container-site py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: contact info + offices */}
          <div className="space-y-5">
            {/* Quick contact */}
            <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-white mb-5">Contact Information</h2>
              <div className="space-y-4">
                <a href={`tel:${phone}`} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-brand-100)] flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-[var(--color-brand-600)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-charcoal-400)]">Primary Phone</p>
                    <p className="text-sm font-medium text-white group-hover:text-[var(--color-brand-500)]">{phone}</p>
                  </div>
                </a>
                <a href={`tel:${phoneSec}`} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-brand-100)] flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-[var(--color-brand-600)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-charcoal-400)]">Secondary Phone</p>
                    <p className="text-sm font-medium text-white group-hover:text-[var(--color-brand-500)]">{phoneSec}</p>
                  </div>
                </a>
                <a href={`mailto:${email}`} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-brand-100)] flex items-center justify-center shrink-0">
                    <Mail size={16} className="text-[var(--color-brand-600)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-charcoal-400)]">Email</p>
                    <p className="text-sm font-medium text-white group-hover:text-[var(--color-brand-500)]">{email}</p>
                  </div>
                </a>
                {settings.business_hours && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[var(--color-brand-100)] flex items-center justify-center shrink-0">
                      <Clock size={16} className="text-[var(--color-brand-600)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-charcoal-400)]">Business Hours</p>
                      <p className="text-sm font-medium text-white">{settings.business_hours}</p>
                    </div>
                  </div>
                )}
              </div>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full justify-center mt-6">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* Office locations */}
            {offices.map((office) => (
              <div key={office.id} className="bg-[var(--color-charcoal-800)] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-[var(--color-brand-500)]" />
                  <h3 className="font-semibold text-sm text-white">{office.name}</h3>
                  {office.isPrimary && <span className="badge-featured text-[9px] ml-auto">Main Office</span>}
                </div>
                <p className="text-xs text-[var(--color-charcoal-400)] mb-2">{office.address}</p>
                {office.phone && <p className="text-xs text-[var(--color-charcoal-300)]">📞 {office.phone}</p>}
                {office.hours && <p className="text-xs text-[var(--color-charcoal-400)] mt-1">🕐 {office.hours}</p>}
              </div>
            ))}
          </div>

          {/* Right: enquiry form (spans 2 columns) */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-white text-xl mb-1">Send Us a Message</h2>
              <p className="text-sm text-[var(--color-charcoal-400)] mb-6">
                Fill in the form and our team will get back to you within 24 hours.
              </p>
              <EnquiryForm type="GENERAL" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
