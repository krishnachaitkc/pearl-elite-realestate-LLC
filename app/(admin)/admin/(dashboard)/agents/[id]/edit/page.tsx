import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import AgentForm from "../../AgentForm";

export const metadata: Metadata = { title: "Edit Agent" };

interface Props { params: Promise<{ id: string }> }

export default async function EditAgentPage({ params }: Props) {
  const { id } = await params;
  const agent = await prisma.agent.findUnique({ where: { id } });
  if (!agent) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Edit Agent</h1>
        <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">{agent.name}</p>
      </div>
      <AgentForm
        initialData={{
          id: agent.id,
          name: agent.name,
          designation: agent.designation,
          phone: agent.phone,
          whatsapp: agent.whatsapp,
          email: agent.email ?? "",
          bio: agent.bio,
          languages: agent.languages,
          featured: agent.featured,
          active: agent.active,
          order: agent.order,
        }}
      />
    </div>
  );
}
