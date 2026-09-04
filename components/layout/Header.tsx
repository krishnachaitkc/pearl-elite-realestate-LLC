"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown, Search } from "lucide-react";

interface HeaderProps {
  settings?: Record<string, string>;
}

const navLinks = [
  { label: "Properties", href: "/properties" },
  {
    label: "Rent",
    href: "/properties?type=RENT",
    children: [
      { label: "Apartments", href: "/properties?type=RENT&propertyType=APARTMENT" },
      { label: "Villas", href: "/properties?type=RENT&propertyType=VILLA" },
      { label: "Commercial", href: "/properties?type=RENT&propertyType=OFFICE" },
    ],
  },
  { label: "Locations", href: "/locations" },
  { label: "Developers", href: "/developers" },
  { label: "About Us", href: "/about" },
];

export default function Header({ settings = {} }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const phone = settings.phone_primary || "0545005113";
  const companyName = settings.company_name || "Pearl Gate Elite";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-charcoal-900)]/98 backdrop-blur-sm shadow-sm border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      {/* Top bar */}
      <div
        className={`transition-all duration-300 ${
          scrolled ? "hidden" : "block"
        } bg-[var(--color-charcoal-900)] text-white`}
      >
        <div className="container-site flex items-center justify-between py-2 text-xs">
          <span className="text-[var(--color-charcoal-400)]">
            Trusted UAE Real Estate Partner Since 2014
          </span>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 hover:text-[var(--color-brand-300)] transition-colors"
            >
              <Phone size={11} />
              <span>{phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`container-site flex items-center justify-between transition-all duration-300 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt={companyName} className="h-10 w-auto object-contain" />
          ) : (
            <div className="flex flex-col">
              <div
                className={`font-semibold leading-tight text-2xl tracking-tight heading-section transition-colors ${
                  "text-white"
                }`}
              >
                Pearl Gate Elite
              </div>
              <div
                className={`text-[11px] tracking-widest uppercase mt-0.5 transition-colors ${
                  "text-[var(--color-brand-300)]"
                }`}
              >
                Real Estate LLC
              </div>
            </div>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative group"
              onMouseEnter={() => link.children && setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                href={link.href}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${
                  "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
                {link.children && <ChevronDown size={13} className="opacity-60" />}
              </Link>

              {/* Dropdown */}
              {link.children && openDropdown === link.label && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-[var(--color-charcoal-800)] rounded-xl shadow-xl border border-white/10 py-2 z-50 animate-fade-in-up">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2.5 text-sm text-[var(--color-charcoal-300)] hover:bg-[var(--color-charcoal-900)] hover:text-[var(--color-brand-500)] transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/properties"
            className={`p-2 rounded-lg transition-colors ${
              "text-white/80 hover:text-white"
            }`}
            aria-label="Search properties"
          >
            <Search size={18} />
          </Link>
          <Link href="/contact" className="btn-primary text-sm px-5 py-2.5">
            Get in Touch
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            "text-white"
          }`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[var(--color-charcoal-800)] border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div className="container-site py-4 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => !link.children && setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-white/90 hover:bg-[var(--color-charcoal-900)] hover:text-[var(--color-brand-500)] transition-colors"
                >
                  {link.label}
                  {link.children && <ChevronDown size={14} />}
                </Link>
                {link.children && (
                  <div className="ml-4 border-l-2 border-[var(--color-brand-200)] pl-4 mb-1 space-y-0.5">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 text-sm text-[var(--color-charcoal-300)] hover:text-[var(--color-brand-500)] transition-colors rounded-md"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-white/10">
              <a href={`tel:${phone}`} className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--color-charcoal-300)]">
                <Phone size={15} className="text-[var(--color-brand-500)]" />
                {phone}
              </a>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full mt-2 justify-center"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}





