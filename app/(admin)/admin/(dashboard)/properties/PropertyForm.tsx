"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, type PropertyFormData } from "@/lib/validations";
import { Loader2 } from "lucide-react";

type SelectOption = { id: string; name: string };
type AmenityOption = { id: string; name: string; category: string | null };

type PropertyFormProps = {
  locations: SelectOption[];
  communities: SelectOption[];
  developers: SelectOption[];
  agents: SelectOption[];
  amenities: AmenityOption[];
  initialData?: Partial<PropertyFormData> & { id?: string };
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-[var(--color-charcoal-300)] mb-1.5 uppercase tracking-wide">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-400 mt-1">{message}</p>;
}

export default function PropertyForm({
  locations,
  communities,
  developers,
  agents,
  amenities,
  initialData,
}: PropertyFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema) as never,
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      priceType: "RENT",
      status: initialData?.status ?? "READY",
      propertyType: initialData?.propertyType ?? "APARTMENT",
      bedrooms: initialData?.bedrooms ?? null,
      bathrooms: initialData?.bathrooms ?? null,
      area: initialData?.area ?? null,
      furnished: initialData?.furnished ?? null,
      referenceNo: initialData?.referenceNo ?? "",
      completionDate: initialData?.completionDate ?? null,
      paymentPlan: initialData?.paymentPlan ?? null,
      floorPlanUrl: initialData?.floorPlanUrl ?? "",
      videoUrl: initialData?.videoUrl ?? "",
      latitude: initialData?.latitude ?? null,
      longitude: initialData?.longitude ?? null,
      locationId: initialData?.locationId ?? null,
      communityId: initialData?.communityId ?? null,
      developerId: initialData?.developerId ?? null,
      agentId: initialData?.agentId ?? null,
      amenityIds: initialData?.amenityIds ?? [],
      featured: initialData?.featured ?? false,
      published: initialData?.published ?? false,
      seoTitle: initialData?.seoTitle ?? "",
      seoDescription: initialData?.seoDescription ?? "",
    },
  });

  const selectedAmenities = watch("amenityIds") ?? [];

  const toggleAmenity = (id: string) => {
    const current = selectedAmenities;
    if (current.includes(id)) {
      setValue("amenityIds", current.filter((a) => a !== id));
    } else {
      setValue("amenityIds", [...current, id]);
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    setSubmitError(null);
    const url = isEdit
      ? `/api/admin/properties/${initialData!.id}`
      : "/api/admin/properties";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setSubmitError(json.error || "Failed to save property");
      return;
    }

    router.push("/admin/properties");
    router.refresh();
  };

  const amenityGroups = amenities.reduce<Record<string, AmenityOption[]>>((acc, a) => {
    const cat = a.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(a);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {submitError && (
        <div className="p-4 bg-red-900/20 border border-red-900/40 rounded-lg text-sm text-red-400">
          {submitError}
        </div>
      )}

      {/* Basic Info */}
      <section className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-5">
        <h2 className="font-semibold text-white">Basic Information</h2>

        <div>
          <FieldLabel required>Title</FieldLabel>
          <input {...register("title")} className="input-base" placeholder="Luxury 3BR Apartment in Downtown Dubai" />
          <FieldError message={errors.title?.message} />
        </div>

        <div>
          <FieldLabel required>Description</FieldLabel>
          <textarea
            {...register("description")}
            rows={5}
            className="input-base resize-y"
            placeholder="Detailed property description..."
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div>
          <FieldLabel required>Reference Number</FieldLabel>
          <input {...register("referenceNo")} className="input-base" placeholder="PG-2024-001" />
          <FieldError message={errors.referenceNo?.message} />
        </div>
      </section>

      {/* Pricing & Type */}
      <section className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-5">
        <h2 className="font-semibold text-white">Pricing & Classification</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel required>Price (AED)</FieldLabel>
            <input {...register("price")} type="number" min="0" step="1" className="input-base" />
            <FieldError message={errors.price?.message} />
          </div>
          <input type="hidden" {...register("priceType")} value="RENT" />
          <div>
            <FieldLabel required>Property Status</FieldLabel>
            <select {...register("status")} className="input-base">
              <option value="READY">Ready</option>
              <option value="OFF_PLAN">Off Plan</option>
            </select>
          </div>
          <div>
            <FieldLabel required>Property Type</FieldLabel>
            <select {...register("propertyType")} className="input-base">
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="TOWNHOUSE">Townhouse</option>
              <option value="PENTHOUSE">Penthouse</option>
              <option value="PLOT">Plot</option>
              <option value="OFFICE">Office</option>
              <option value="RETAIL">Retail</option>
              <option value="WAREHOUSE">Warehouse</option>
              <option value="DUPLEX">Duplex</option>
            </select>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-5">
        <h2 className="font-semibold text-white">Property Details</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <FieldLabel>Bedrooms</FieldLabel>
            <input {...register("bedrooms")} type="number" min="0" className="input-base" />
          </div>
          <div>
            <FieldLabel>Bathrooms</FieldLabel>
            <input {...register("bathrooms")} type="number" min="0" className="input-base" />
          </div>
          <div>
            <FieldLabel>Area (sqft)</FieldLabel>
            <input {...register("area")} type="number" min="0" className="input-base" />
          </div>
          <div>
            <FieldLabel>Furnished</FieldLabel>
            <select {...register("furnished")} className="input-base">
              <option value="">—</option>
              <option value="FURNISHED">Furnished</option>
              <option value="UNFURNISHED">Unfurnished</option>
              <option value="SEMI_FURNISHED">Semi Furnished</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Completion Date</FieldLabel>
            <input {...register("completionDate")} type="date" className="input-base" />
          </div>
          <div>
            <FieldLabel>Payment Plan</FieldLabel>
            <input {...register("paymentPlan")} className="input-base" placeholder="60/40 payment plan" />
          </div>
        </div>
      </section>

      {/* Relations */}
      <section className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-5">
        <h2 className="font-semibold text-white">Location & Assignment</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Location</FieldLabel>
            <select {...register("locationId")} className="input-base">
              <option value="">— Select —</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Community</FieldLabel>
            <select {...register("communityId")} className="input-base">
              <option value="">— Select —</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Developer</FieldLabel>
            <select {...register("developerId")} className="input-base">
              <option value="">— Select —</option>
              {developers.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Assigned Agent</FieldLabel>
            <select {...register("agentId")} className="input-base">
              <option value="">— Select —</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Latitude</FieldLabel>
            <input {...register("latitude")} type="number" step="any" className="input-base" />
          </div>
          <div>
            <FieldLabel>Longitude</FieldLabel>
            <input {...register("longitude")} type="number" step="any" className="input-base" />
          </div>
        </div>
      </section>

      {/* Media URLs */}
      <section className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-5">
        <h2 className="font-semibold text-white">Media</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Floor Plan URL</FieldLabel>
            <input {...register("floorPlanUrl")} type="url" className="input-base" placeholder="https://..." />
            <FieldError message={errors.floorPlanUrl?.message} />
          </div>
          <div>
            <FieldLabel>Video URL</FieldLabel>
            <input {...register("videoUrl")} type="url" className="input-base" placeholder="https://..." />
            <FieldError message={errors.videoUrl?.message} />
          </div>
        </div>
      </section>

      {/* Amenities */}
      {amenities.length > 0 && (
        <section className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-5">
          <h2 className="font-semibold text-white">Amenities</h2>
          {Object.entries(amenityGroups).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-[var(--color-charcoal-400)] uppercase tracking-wide mb-2">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAmenity(a.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedAmenities.includes(a.id)
                        ? "bg-[var(--color-brand-500)] text-white border-[var(--color-brand-500)]"
                        : "bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-300)] border-white/10 hover:border-[var(--color-brand-400)]"
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* SEO & Publishing */}
      <section className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6 space-y-5">
        <h2 className="font-semibold text-white">SEO & Publishing</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>SEO Title</FieldLabel>
            <input {...register("seoTitle")} className="input-base" maxLength={70} />
          </div>
          <div>
            <FieldLabel>SEO Description</FieldLabel>
            <input {...register("seoDescription")} className="input-base" maxLength={160} />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("featured")} className="w-4 h-4 accent-[var(--color-brand-500)]" />
            <span className="text-sm font-medium text-[var(--color-charcoal-300)]">Featured Property</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("published")} className="w-4 h-4 accent-[var(--color-brand-500)]" />
            <span className="text-sm font-medium text-[var(--color-charcoal-300)]">Published</span>
          </label>
        </div>
      </section>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEdit ? "Update Property" : "Create Property"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
