import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import AgentsTable from "./AgentsTable";
import { Plus } from "lucide-react";

export const metadata: Metadata = { title: "Agents" };
export const dynamic = "force-dynamic";

export default async function AdminAgentsPage() {
  const agents = await prisma.agent.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agents</h1>
          <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">{agents.length} agents</p>
        </div>
        <Link href="/admin/agents/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Add Agent
        </Link>
      </div>
      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-6">
        <AgentsTable agents={agents} />
      </div>
    </div>
  );
}
