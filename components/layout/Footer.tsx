import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon, XIcon } from "@/components/layout/SocialIcons";

interface FooterProps {
  settings?: Record<string, string>;
}

export default function Footer({ settings = {} }: FooterProps) {
  const phone = settings.phone_primary || "0545005113";
  const phoneSec = settings.phone_secondary || "0581718701";
  const email = settings.email_primary || "info@pearlgateelite.com";
  const address = settings.address || "Dubai, United Arab Emirates";
  const companyName = settings.company_name || "Pearl Gate Elite Real Estate LLC";
  const whatsapp = settings.whatsapp_number || "971545005113";

  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-charcoal-900)] text-white">
      {/* WhatsApp CTA Banner */}
      <div className="bg-[var(--color-charcoal-800)] border-b border-white/5">
        <div className="container-site py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-white">Chat with us on WhatsApp</p>
            <p className="text-sm text-white/80">Get instant responses to your property enquiries</p>
          </div>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello Pearl Gate Elite! I'm interested in your properties.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-[#25D366] text-white hover:bg-[#1EBE5D] font-semibold text-sm px-6 py-2.5 rounded-lg  transition-colors"
          >
            WhatsApp Us Now
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex flex-col mb-5">
              <div className="font-semibold text-white leading-tight text-2xl heading-section">Pearl Gate Elite</div>
              <div className="text-[11px] tracking-widest uppercase mt-0.5 text-[var(--color-brand-400)]">Real Estate LLC</div>
            </div>
            <p className="text-sm text-[var(--color-charcoal-400)] leading-relaxed mb-6">
              Your trusted partner for premium real estate in Dubai and across the UAE. Residential, commercial, and investment properties.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-md bg-[var(--color-charcoal-800)]/10 flex items-center justify-center hover:bg-[var(--color-brand-500)] transition-colors">
                  <FacebookIcon />
                </a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-md bg-[var(--color-charcoal-800)]/10 flex items-center justify-center hover:bg-[var(--color-brand-500)] transition-colors">
                  <InstagramIcon />
                </a>
              )}
              {settings.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-md bg-[var(--color-charcoal-800)]/10 flex items-center justify-center hover:bg-[var(--color-brand-500)] transition-colors">
                  <XIcon />
                </a>
              )}
              {settings.social_linkedin && (
                <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-md bg-[var(--color-charcoal-800)]/10 flex items-center justify-center hover:bg-[var(--color-brand-500)] transition-colors">
                  <LinkedinIcon />
                </a>
              )}
              {settings.social_youtube && (
                <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-md bg-[var(--color-charcoal-800)]/10 flex items-center justify-center hover:bg-[var(--color-brand-500)] transition-colors">
                  <YoutubeIcon />
                </a>
              )}
              {!settings.social_facebook && !settings.social_instagram && (
                <>
                  <div className="w-8 h-8 rounded-md bg-[var(--color-charcoal-800)]/10 flex items-center justify-center"><FacebookIcon className="text-[var(--color-charcoal-400)]" /></div>
                  <div className="w-8 h-8 rounded-md bg-[var(--color-charcoal-800)]/10 flex items-center justify-center"><InstagramIcon className="text-[var(--color-charcoal-400)]" /></div>
                  <div className="w-8 h-8 rounded-md bg-[var(--color-charcoal-800)]/10 flex items-center justify-center"><LinkedinIcon className="text-[var(--color-charcoal-400)]" /></div>
                </>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-label text-[var(--color-brand-400)] mb-5">Properties</h4>
            <ul className="space-y-3">
              {[
                { label: "Rent Property", href: "/properties?type=RENT" },
                { label: "Luxury Villas", href: "/properties?propertyType=VILLA" },
                { label: "Apartments", href: "/properties?propertyType=APARTMENT" },
                { label: "Commercial", href: "/properties?propertyType=OFFICE" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-brand-300)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-label text-[var(--color-brand-400)] mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: "Locations", href: "/locations" },
                { label: "Communities", href: "/communities" },
                { label: "Developers", href: "/developers" },
                { label: "Our Agents", href: "/agents" },
                { label: "About Us", href: "/about" },
                { label: "Blog & News", href: "/blog" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[var(--color-charcoal-400)] hover:text-[var(--color-brand-300)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-label text-[var(--color-brand-400)] mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={14} className="text-[var(--color-brand-400)] mt-0.5 shrink-0" />
                <div>
                  <a href={`tel:${phone}`} className="text-sm text-[var(--color-charcoal-400)] hover:text-white transition-colors block">{phone}</a>
                  <a href={`tel:${phoneSec}`} className="text-sm text-[var(--color-charcoal-400)] hover:text-white transition-colors block">{phoneSec}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="text-[var(--color-brand-400)] mt-0.5 shrink-0" />
                <a href={`mailto:${email}`} className="text-sm text-[var(--color-charcoal-400)] hover:text-white transition-colors">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-[var(--color-brand-400)] mt-0.5 shrink-0" />
                <span className="text-sm text-[var(--color-charcoal-400)]">{address}</span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-xs text-[var(--color-charcoal-400)] mb-1">Business Hours</p>
              <p className="text-sm text-[var(--color-charcoal-400)]">{settings.business_hours || "Mon–Fri: 9am–6pm"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-site py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-charcoal-400)]">
            © {year} {companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-xs text-[var(--color-charcoal-400)] hover:text-[var(--color-brand-400)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-[var(--color-charcoal-400)] hover:text-[var(--color-brand-400)] transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="text-xs text-[var(--color-charcoal-400)] hover:text-[var(--color-brand-400)] transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}






