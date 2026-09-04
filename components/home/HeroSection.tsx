"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const propertyTypes = [
  "Apartment", "Villa", "Townhouse", "Penthouse", "Plot", "Office", "Retail"
];

const locations = [
  "Dubai Marina", "Downtown Dubai", "Palm Jumeirah", "JVC", "Business Bay", "Arabian Ranches"
];

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

export default function HeroSection({
  title = "Find Your Perfect\nProperty in UAE",
  subtitle = "Discover exclusive properties across Dubai and the UAE. Premium residences, investment opportunities and commercial spaces curated for discerning renters.",
  ctaPrimary = "Browse Properties",
  ctaSecondary = "Contact Us",
}: HeroSectionProps) {
  const router = useRouter();
    const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("priceType", "RENT");
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedType) params.set("propertyType", selectedType.toUpperCase());
    if (keyword) params.set("q", keyword);
    router.push(`/properties?${params.toString()}`);
  };

  const titleLines = title.split("\n");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80')`,
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-site w-full pt-28 pb-16">
        <div className="max-w-3xl">
          {/* Label */}
          <div className="flex items-center gap-2 mb-6 animate-fade-in-up">
            <span className="block w-6 h-px bg-[var(--color-brand-400)]" />
            <span className="text-label text-[var(--color-brand-300)]">
              Premium UAE Real Estate
            </span>
          </div>

          {/* Title */}
          <h1 className="heading-display text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6 animate-fade-in-up">
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <span className="text-[var(--color-brand-300)]">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-base sm:text-lg max-w-xl mb-10 leading-relaxed animate-fade-in-up">
            {subtitle}
          </p>

          {/* Search widget */}
          <div className="bg-[var(--color-charcoal-900)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            

            {/* Search fields */}
            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Location */}
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-brand-500)]" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="input-base pl-9 pr-8 appearance-none cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal-400)] pointer-events-none" />
                </div>

                {/* Property type */}
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="input-base pr-8 appearance-none cursor-pointer"
                  >
                    <option value="">Property Type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal-400)] pointer-events-none" />
                </div>

                {/* Keyword */}
                <input
                  type="text"
                  placeholder="Search by keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="input-base"
                />
              </div>

              <button
                onClick={handleSearch}
                className="btn-primary w-full mt-3 gap-2"
              >
                <Search size={16} />
                Search Properties
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-8 mt-10 animate-fade-in-up">
            {[
              { value: "1,200+", label: "Properties" },
              { value: "500+", label: "Happy Clients" },
              { value: "10+", label: "Years Experience" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white heading-display">{stat.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-5 h-8 border-2 border-white/40 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-[var(--color-charcoal-900)]/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
