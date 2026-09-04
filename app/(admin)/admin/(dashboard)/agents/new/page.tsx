import type { Metadata } from "next";
import AgentForm from "../AgentForm";

export const metadata: Metadata = { title: "New Agent" };

export default function NewAgentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Agent</h1>
        <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">Add a new team member</p>
      </div>
      <AgentForm />
    </div>
  );
}
