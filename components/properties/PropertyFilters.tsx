"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";

interface Location { id: string; name: string; }
interface Developer { id: string; name: string; }

interface PropertyFiltersProps {
  currentParams: Record<string, string>;
  locations: Location[];
  developers: Developer[];
}

const propertyTypes = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "PENTHOUSE", label: "Penthouse" },
  { value: "DUPLEX", label: "Duplex" },
  { value: "PLOT", label: "Plot" },
  { value: "OFFICE", label: "Office" },
  { value: "RETAIL", label: "Retail" },
  { value: "WAREHOUSE", label: "Warehouse" },
];

const bedroomOptions = ["Studio", "1", "2", "3", "4", "5+"];
const bathroomOptions = ["1", "2", "3", "4", "5+"];

export default function PropertyFilters({
  currentParams,
  locations,
  developers,
}: PropertyFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [filters, setFilters] = useState({
    priceType: currentParams.priceType || "",
    status: currentParams.status || "",
    propertyType: currentParams.propertyType || "",
    locationName: currentParams.location || "",
    bedrooms: currentParams.bedrooms || "",
    bathrooms: currentParams.bathrooms || "",
    minPrice: currentParams.minPrice || "",
    maxPrice: currentParams.maxPrice || "",
    furnished: currentParams.furnished || "",
    sort: currentParams.sort || "newest",
  });

  const applyFilters = (updated: typeof filters) => {
    const params = new URLSearchParams();
    if (updated.priceType) params.set("priceType", updated.priceType);
    if (updated.status) params.set("status", updated.status);
    if (updated.propertyType) params.set("propertyType", updated.propertyType);
    if (updated.locationName) params.set("location", updated.locationName);
    if (updated.bedrooms) params.set("bedrooms", updated.bedrooms === "5+" ? "5" : updated.bedrooms);
    if (updated.bathrooms) params.set("bathrooms", updated.bathrooms === "5+" ? "5" : updated.bathrooms);
    if (updated.minPrice) params.set("minPrice", updated.minPrice);
    if (updated.maxPrice) params.set("maxPrice", updated.maxPrice);
    if (updated.furnished) params.set("furnished", updated.furnished);
    if (updated.sort) params.set("sort", updated.sort);
    if (currentParams.q) params.set("q", currentParams.q);
    startTransition(() => router.push(`/properties?${params.toString()}`));
  };

  const update = (key: keyof typeof filters, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    applyFilters(updated);
  };

  const clearAll = () => {
    const cleared = {
      priceType: "", status: "", propertyType: "", locationName: "",
      bedrooms: "", bathrooms: "", minPrice: "", maxPrice: "", furnished: "", sort: "newest",
    };
    setFilters(cleared);
    startTransition(() => router.push("/properties"));
  };

  const hasActiveFilters = Object.entries(filters).some(([k, v]) => v && k !== "sort");

  const filterContent = (
    <div className="space-y-5">
      {/* Sort */}
      <FilterGroup label="Sort By">
        <select
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value)}
          className="input-base text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </FilterGroup>

      

      {/* Status */}
      <FilterGroup label="Status">
        <div className="flex gap-2">
          {[{ v: "", l: "All" }, { v: "READY", l: "Ready" }, { v: "OFF_PLAN", l: "Off-Plan" }].map((o) => (
            <button
              key={o.v}
              onClick={() => update("status", o.v)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                filters.status === o.v
                  ? "bg-[var(--color-brand-500)] text-white border-[var(--color-brand-500)]"
                  : "border-white/10 text-[var(--color-charcoal-300)] hover:border-[var(--color-brand-400)]"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Property type */}
      <FilterGroup label="Property Type">
        <select
          value={filters.propertyType}
          onChange={(e) => update("propertyType", e.target.value)}
          className="input-base text-sm"
        >
          <option value="">Any Type</option>
          {propertyTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </FilterGroup>

      {/* Location */}
      <FilterGroup label="Location">
        <select
          value={filters.locationName}
          onChange={(e) => update("locationName", e.target.value)}
          className="input-base text-sm"
        >
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l.id} value={l.name}>{l.name}</option>
          ))}
        </select>
      </FilterGroup>

      {/* Price range */}
      <FilterGroup label="Price Range (AED)">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
            onBlur={() => applyFilters(filters)}
            className="input-base text-sm flex-1 min-w-0"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
            onBlur={() => applyFilters(filters)}
            className="input-base text-sm flex-1 min-w-0"
          />
        </div>
      </FilterGroup>

      {/* Bedrooms */}
      <FilterGroup label="Bedrooms">
        <div className="flex flex-wrap gap-1.5">
          {bedroomOptions.map((b) => (
            <button
              key={b}
              onClick={() => update("bedrooms", filters.bedrooms === (b === "Studio" ? "0" : b) ? "" : b === "Studio" ? "0" : b)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filters.bedrooms === (b === "Studio" ? "0" : b)
                  ? "bg-[var(--color-brand-500)] text-white border-[var(--color-brand-500)]"
                  : "border-white/10 text-[var(--color-charcoal-300)] hover:border-[var(--color-brand-400)]"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Bathrooms */}
      <FilterGroup label="Bathrooms">
        <div className="flex flex-wrap gap-1.5">
          {bathroomOptions.map((b) => (
            <button
              key={b}
              onClick={() => update("bathrooms", filters.bathrooms === b ? "" : b)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filters.bathrooms === b
                  ? "bg-[var(--color-brand-500)] text-white border-[var(--color-brand-500)]"
                  : "border-white/10 text-[var(--color-charcoal-300)] hover:border-[var(--color-brand-400)]"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Furnished */}
      <FilterGroup label="Furnished">
        <select
          value={filters.furnished}
          onChange={(e) => update("furnished", e.target.value)}
          className="input-base text-sm"
        >
          <option value="">Any</option>
          <option value="FURNISHED">Furnished</option>
          <option value="UNFURNISHED">Unfurnished</option>
          <option value="SEMI_FURNISHED">Semi-Furnished</option>
        </select>
      </FilterGroup>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-400 border border-red-900/40 rounded-lg hover:bg-red-900/20 transition-colors"
        >
          <X size={14} />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden w-full flex items-center justify-between p-4 bg-[var(--color-charcoal-800)] rounded-xl shadow-sm mb-4"
      >
        <span className="flex items-center gap-2 font-medium text-sm text-white/90">
          <SlidersHorizontal size={16} className="text-[var(--color-brand-500)]" />
          Filters {hasActiveFilters && <span className="bg-[var(--color-brand-500)] text-white text-xs px-1.5 py-0.5 rounded-full">Active</span>}
        </span>
        <ChevronDown size={16} className={`transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[var(--color-charcoal-800)] rounded-xl p-5 shadow-sm mb-6">
          {filterContent}
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block bg-[var(--color-charcoal-800)] rounded-xl p-5 shadow-sm sticky top-24">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[var(--color-brand-500)]" />
            Filters
          </h3>
          {hasActiveFilters && (
            <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-400">
              Clear All
            </button>
          )}
        </div>
        {isPending && (
          <div className="text-xs text-[var(--color-charcoal-400)] mb-3 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[var(--color-brand-500)] rounded-full animate-pulse" />
            Updating results...
          </div>
        )}
        {filterContent}
      </div>
    </>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-label text-[var(--color-charcoal-400)] block mb-2">{label}</label>
      {children}
    </div>
  );
}

