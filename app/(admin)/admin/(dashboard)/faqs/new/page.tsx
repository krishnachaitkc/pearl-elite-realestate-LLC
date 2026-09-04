import type { Metadata } from "next";
import FAQForm from "../FAQForm";

export const metadata: Metadata = { title: "New FAQ" };

export default function NewFAQPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New FAQ</h1>
      <FAQForm />
    </div>
  );
}
