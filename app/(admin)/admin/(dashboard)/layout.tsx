import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Bell, User } from "lucide-react";

export const metadata: Metadata = {
  title: {
    default: "Admin — Pearl Gate Elite Real Estate",
    template: "%s | Admin — Pearl Gate",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-charcoal-900)]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-[var(--color-charcoal-800)] border-b border-white/10 flex items-center justify-between px-6 shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-white/90">
              Pearl Gate Admin
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-[var(--color-charcoal-900)] text-[var(--color-charcoal-400)] transition-colors relative">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-7 h-7 rounded-full bg-[var(--color-brand-500)] flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="hidden md:block text-right">
                <p className="text-xs font-semibold text-white/90 leading-tight">
                  {session.user?.name ?? "Admin"}
                </p>
                <p className="text-xs text-[var(--color-charcoal-400)] leading-tight">
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

