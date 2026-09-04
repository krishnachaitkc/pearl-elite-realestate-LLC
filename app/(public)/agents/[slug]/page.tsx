import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Phone, Mail, MapPin, Globe, ArrowRight } from "lucide-react";
import { PropertyCard } from "@/components/home/FeaturedProperties";
import EnquiryForm from "@/components/properties/EnquiryForm";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = await prisma.agent.findUnique({ where: { slug }, select: { name: true, designation: true } });
  if (!agent) return { title: "Agent Not Found" };
  return { title: `${agent.name} — ${agent.designation || "Property Agent"}` };
}

export default async function AgentProfilePage({ params }: Props) {
  const { slug } = await params;
  const agent = await prisma.agent.findUnique({
    where: { slug, active: true },
    include: {
      properties: {
        where: { published: true },
        include: { images: { orderBy: { order: "asc" }, take: 1 }, location: { select: { name: true } }, community: { select: { name: true } } },
        take: 6,
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!agent) notFound();

  const waUrl = `https://wa.me/${(agent.whatsapp || "971545005113").replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${agent.name}, I found your profile on Pearl Gate Elite Real Estate.`)}`;

  return (
    <div className="min-h-screen bg-[var(--color-charcoal-900)] pt-20">
      {/* Profile hero */}
      <div className="bg-[var(--color-charcoal-900)] py-14">
        <div className="container-site">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 ring-4 ring-[var(--color-brand-500)]/30">
              <img
                src={agent.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&size=400&background=9d7a3e&color=ffffff&bold=true`}
                alt={agent.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="heading-section text-white text-2xl md:text-3xl">{agent.name}</h1>
              {agent.designation && <p className="text-[var(--color-brand-400)] font-medium mt-1">{agent.designation}</p>}
              {agent.languages.length > 0 && (
                <p className="text-[var(--color-charcoal-400)] text-sm mt-2">Languages: {agent.languages.join(", ")}</p>
              )}
              <p className="text-[var(--color-charcoal-400)] text-sm mt-1">{agent.properties.length} Active Listings</p>
              <div className="flex flex-wrap gap-3 mt-4">
                {agent.phone && (
                  <a href={`tel:${agent.phone}`} className="btn-outline-white text-sm px-5 py-2.5">
                    <Phone size={14} /> {agent.phone}
                  </a>
                )}
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-sm px-5 py-2.5">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {agent.bio && (
              <div className="bg-[var(--color-charcoal-800)] rounded-2xl p-6 shadow-sm">
                <h2 className="font-semibold text-lg text-white mb-3">About {agent.name}</h2>
                <p className="text-sm text-[var(--color-charcoal-300)] leading-relaxed">{agent.bio}</p>
              </div>
            )}
            {agent.properties.length > 0 && (
              <div>
                <h2 className="font-semibold text-xl text-white mb-5">Listings by {agent.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {agent.properties.map((p) => <PropertyCard key={p.id} property={p as any} />)}
                </div>
              </div>
            )}
          </div>
          <div>
            <EnquiryForm agentId={agent.id} type="AGENT" />
          </div>
        </div>
      </div>
    </div>
  );
}
