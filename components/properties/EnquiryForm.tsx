"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryFormData } from "@/lib/validations";
import { CheckCircle2, Loader2, Send } from "lucide-react";

interface EnquiryFormProps {
  propertyId?: string;
  agentId?: string;
  type?: "GENERAL" | "PROPERTY" | "AGENT" | "VIEWING" | "CALLBACK";
  compact?: boolean;
}

export default function EnquiryForm({
  propertyId,
  agentId,
  type = "PROPERTY",
  compact = false,
}: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema) as never,
    defaultValues: {
      type: propertyId ? "PROPERTY" : "GENERAL",
      propertyId,
      agentId,
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to submit");
      }
      setSubmitted(true);
      reset();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={24} className="text-green-600" />
        </div>
        <h3 className="font-semibold text-white mb-2">Enquiry Sent!</h3>
        <p className="text-sm text-[var(--color-charcoal-400)]">
          Thank you! Our team will be in touch with you shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-xs text-[var(--color-brand-500)] hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-5 shadow-sm">
      <h3 className="font-semibold text-white mb-1">
        {type === "VIEWING" ? "Request a Viewing" : "Send an Enquiry"}
      </h3>
      <p className="text-xs text-[var(--color-charcoal-400)] mb-5">
        Fill in your details and we&apos;ll get back to you shortly.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <input type="hidden" {...register("propertyId")} />
        <input type="hidden" {...register("agentId")} />
        <input type="hidden" {...register("type")} />
        <input type="hidden" {...register("source")} value="property_page" />

        <div>
          <label className="text-xs font-medium text-[var(--color-charcoal-300)] block mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            placeholder="Your full name"
            className="input-base"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--color-charcoal-300)] block mb-1.5">
            Phone Number
          </label>
          <input
            {...register("phone")}
            placeholder="+971 50 000 0000"
            className="input-base"
            type="tel"
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--color-charcoal-300)] block mb-1.5">
            Email Address
          </label>
          <input
            {...register("email")}
            placeholder="your@email.com"
            className="input-base"
            type="email"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {!compact && (
          <div>
            <label className="text-xs font-medium text-[var(--color-charcoal-300)] block mb-1.5">
              Enquiry Type
            </label>
            <select {...register("type")} className="input-base">
              <option value="PROPERTY">Property Enquiry</option>
              <option value="VIEWING">Request a Viewing</option>
              <option value="CALLBACK">Request a Callback</option>
              <option value="GENERAL">General Enquiry</option>
            </select>
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-[var(--color-charcoal-300)] block mb-1.5">
            Message
          </label>
          <textarea
            {...register("message")}
            placeholder="I'm interested in this property and would like more information..."
            rows={3}
            className="input-base resize-none"
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full justify-center gap-2"
        >
          {submitting ? (
            <><Loader2 size={15} className="animate-spin" /> Sending...</>
          ) : (
            <><Send size={15} /> Send Enquiry</>
          )}
        </button>
      </form>
    </div>
  );
}
