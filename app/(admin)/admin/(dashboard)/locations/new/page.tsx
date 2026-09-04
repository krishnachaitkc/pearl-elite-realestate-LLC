import type { Metadata } from "next";
import LocationForm from "../LocationForm";

export const metadata: Metadata = { title: "New Location" };

export default function NewLocationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Location</h1>
        <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">Add a new location</p>
      </div>
      <LocationForm />
    </div>
  );
}
