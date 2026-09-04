import type { Metadata } from "next";
import TestimonialForm from "../TestimonialForm";

export const metadata: Metadata = { title: "New Testimonial" };

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Testimonial</h1>
      <TestimonialForm />
    </div>
  );
}
