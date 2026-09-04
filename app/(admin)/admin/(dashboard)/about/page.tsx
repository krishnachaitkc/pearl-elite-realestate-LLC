import type { Metadata } from "next";
import { getAboutContent } from "@/lib/about";
import AboutForm from "./AboutForm";

export const metadata: Metadata = { title: "About Us" };
export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const content = await getAboutContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">About Us</h1>
        <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">
          Edit the content displayed on the public About Us page
        </p>
      </div>
      <AboutForm content={content} />
    </div>
  );
}
