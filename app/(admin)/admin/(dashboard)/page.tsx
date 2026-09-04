import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import StatsCard from "@/components/admin/StatsCard";
import {
  Building2,
  CheckCircle,
  FileText,
  Star,
  MessageSquare,
  Users,
  MapPin,
  Map,
  HardHat,
  TrendingUp,
  Plus,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  const [
    totalProperties,
    publishedProperties,
    draftProperties,
    featuredProperties,
    totalEnquiries,
    newEnquiries,
    totalAgents,
    totalLocations,
    totalDevelopers,
    totalCommunities,
    recentEnquiries,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { published: true } }),
    prisma.property.count({ where: { published: false } }),
    prisma.property.count({ where: { featured: true } }),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.agent.count({ where: { active: true } }),
    prisma.location.count(),
    prisma.developer.count(),
    prisma.community.count(),
    prisma.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        type: true,
        status: true,
        createdAt: true,
        property: { select: { title: true } },
      },
    }),
  ]);

  return {
    totalProperties,
    publishedProperties,
    draftProperties,
    featuredProperties,
    totalEnquiries,
    newEnquiries,
    totalAgents,
    totalLocations,
    totalDevelopers,
    totalCommunities,
    recentEnquiries,
  };
}

const enquiryStatusColors: Record<string, string> = {
  NEW: "bg-blue-900/40 text-blue-400",
  CONTACTED: "bg-yellow-900/40 text-yellow-400",
  QUALIFIED: "bg-purple-900/40 text-purple-400",
  VIEWING_SCHEDULED: "bg-orange-900/40 text-orange-400",
  CLOSED: "bg-green-900/40 text-green-400",
  NOT_INTERESTED: "bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-300)]",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--color-charcoal-400)] mt-0.5">
            Overview of Pearl Gate Elite Real Estate
          </p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Property
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard
          title="Total Properties"
          value={stats.totalProperties}
          icon={<Building2 className="w-5 h-5 text-blue-400" />}
          iconBg="bg-blue-900/20"
        />
        <StatsCard
          title="Published"
          value={stats.publishedProperties}
          icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-900/20"
        />
        <StatsCard
          title="Drafts"
          value={stats.draftProperties}
          icon={<FileText className="w-5 h-5 text-amber-400" />}
          iconBg="bg-amber-900/20"
        />
        <StatsCard
          title="Featured"
          value={stats.featuredProperties}
          icon={<Star className="w-5 h-5 text-[var(--color-brand-500)]" />}
          iconBg="bg-[var(--color-brand-50)]"
        />
        <StatsCard
          title="New Enquiries"
          value={stats.newEnquiries}
          icon={<MessageSquare className="w-5 h-5 text-purple-400" />}
          iconBg="bg-purple-900/20"
          change={`${stats.totalEnquiries} total`}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Active Agents"
          value={stats.totalAgents}
          icon={<Users className="w-5 h-5 text-indigo-400" />}
          iconBg="bg-indigo-900/20"
        />
        <StatsCard
          title="Locations"
          value={stats.totalLocations}
          icon={<MapPin className="w-5 h-5 text-red-400" />}
          iconBg="bg-red-900/20"
        />
        <StatsCard
          title="Communities"
          value={stats.totalCommunities}
          icon={<Map className="w-5 h-5 text-teal-400" />}
          iconBg="bg-teal-900/20"
        />
        <StatsCard
          title="Developers"
          value={stats.totalDevelopers}
          icon={<HardHat className="w-5 h-5 text-orange-400" />}
          iconBg="bg-orange-900/20"
        />
      </div>

      {/* Recent enquiries */}
      <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--color-brand-500)]" />
            <h2 className="font-semibold text-white">
              Recent Enquiries
            </h2>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs text-[var(--color-brand-500)] hover:text-[var(--color-brand-600)] font-semibold"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-charcoal-900)] border-b border-white/10">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-charcoal-400)]">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-charcoal-400)]">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-charcoal-400)]">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-charcoal-400)]">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-charcoal-400)]">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.recentEnquiries.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-[var(--color-charcoal-400)]"
                  >
                    No enquiries yet.
                  </td>
                </tr>
              ) : (
                stats.recentEnquiries.map((enq, i) => (
                  <tr
                    key={enq.id}
                    className={`border-b border-white/10 hover:bg-white/5 transition-colors ${i % 2 === 0 ? "bg-[var(--color-charcoal-800)]" : "bg-[var(--color-charcoal-900)]/30"}`}
                  >
                    <td className="px-6 py-3 font-medium text-white">
                      {enq.name}
                    </td>
                    <td className="px-6 py-3 text-[var(--color-charcoal-300)]">
                      {enq.phone ?? enq.email ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-[var(--color-charcoal-300)]">
                      {enq.property?.title ?? "—"}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${enquiryStatusColors[enq.status] ?? "bg-[var(--color-charcoal-800)] text-[var(--color-charcoal-300)]"}`}
                      >
                        {enq.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[var(--color-charcoal-400)]">
                      {new Date(enq.createdAt).toLocaleDateString("en-AE", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/admin/properties/new", label: "Add Property", icon: Building2 },
          { href: "/admin/agents/new", label: "Add Agent", icon: Users },
          { href: "/admin/locations/new", label: "Add Location", icon: MapPin },
          { href: "/admin/blog/new", label: "New Article", icon: FileText },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="bg-[var(--color-charcoal-800)] rounded-xl p-4 flex items-center gap-3 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:border-[var(--color-brand-500)] border border-white/10 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-50)] flex items-center justify-center group-hover:bg-[var(--color-brand-500)] transition-colors">
              <Icon className="w-4 h-4 text-[var(--color-brand-500)] group-hover:text-white transition-colors" />
            </div>
            <span className="text-sm font-semibold text-white/90">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
