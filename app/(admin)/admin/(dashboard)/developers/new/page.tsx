import type { Metadata } from "next";
import DeveloperForm from "../DeveloperForm";

export const metadata: Metadata = { title: "New Developer" };

export default function NewDeveloperPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Developer</h1>
      <DeveloperForm />
    </div>
  );
}
