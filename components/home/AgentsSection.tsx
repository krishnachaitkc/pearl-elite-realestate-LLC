import Link from "next/link";
import { Phone, Mail, ArrowRight } from "lucide-react";

interface Agent {
  id: string;
  slug: string;
  name: string;
  photoUrl: string | null;
  designation: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  languages: string[];
  _count?: { properties: number };
}

interface AgentsSectionProps {
  agents: Agent[];
  whatsappNumber?: string;
}

export default function AgentsSection({ agents, whatsappNumber = "971545005113" }: AgentsSectionProps) {
  const displayed = agents.slice(0, 4);

  return (
    <section className="section-padding bg-[var(--color-charcoal-900)]">
      <div className="container-site">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-label text-[var(--color-brand-500)] block mb-3">
              Meet the Team
            </span>
            <h2 className="heading-section text-white text-3xl lg:text-4xl">
              Our Expert Agents
            </h2>
            <span className="divider-gold-left mt-3" />
          </div>
          <Link
            href="/agents"
            className="flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-500)] hover:text-[var(--color-brand-600)] transition-colors shrink-0"
          >
            All Agents
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Agents grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
          {displayed.map((agent) => {
            const agentWhatsApp = agent.whatsapp || whatsappNumber;
            return (
              <div key={agent.id} className="group card-premium text-center">
                {/* Photo */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={
                      agent.photoUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&size=400&background=9d7a3e&color=ffffff&bold=true`
                    }
                    alt={agent.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[var(--color-brand-500)]/0 group-hover:bg-[var(--color-brand-500)]/10 transition-colors duration-300" />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-semibold text-white text-base mb-0.5">
                    {agent.name}
                  </h3>
                  {agent.designation && (
                    <p className="text-xs text-[var(--color-brand-500)] font-medium mb-3">
                      {agent.designation}
                    </p>
                  )}
                  {agent.languages.length > 0 && (
                    <p className="text-xs text-[var(--color-charcoal-400)] mb-4">
                      {agent.languages.join(" · ")}
                    </p>
                  )}
                  {agent._count && (
                    <p className="text-xs text-[var(--color-charcoal-400)] mb-4">
                      {agent._count.properties} Properties
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {agent.phone && (
                      <a
                        href={`tel:${agent.phone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/10 text-xs font-medium text-[var(--color-charcoal-300)] hover:border-[var(--color-brand-500)] hover:text-[var(--color-brand-500)] transition-colors"
                      >
                        <Phone size={12} />
                        Call
                      </a>
                    )}
                    <a
                      href={`https://wa.me/${agentWhatsApp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${agent.name}, I found your profile on Pearl Gate Elite Real Estate.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#25D366] text-xs font-medium text-white hover:bg-[#1da851] transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </div>

                  <Link
                    href={`/agents/${agent.slug}`}
                    className="mt-3 flex items-center justify-center gap-1 text-xs text-[var(--color-charcoal-400)] hover:text-[var(--color-brand-500)] transition-colors"
                  >
                    View Profile <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
