"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Map,
  HardHat,
  Users,
  MessageSquare,
  FileText,
  Star,
  HelpCircle,
  Info,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/properties", label: "Properties", icon: Building2 },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/communities", label: "Communities", icon: Map },
  { href: "/admin/developers", label: "Developers", icon: HardHat },
  { href: "/admin/agents", label: "Agents", icon: Users },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/about", label: "About Us", icon: Info },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <aside
      className={`admin-sidebar flex flex-col h-full transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
      style={{ background: "var(--color-charcoal-900)" }}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <div className="font-semibold text-white leading-tight text-xl heading-section truncate">Pearl Gate Elite</div>
            <div className="text-[10px] tracking-widest uppercase mt-0.5 text-[var(--color-brand-400)] truncate">Real Estate LLC</div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-md bg-[var(--color-brand-500)] flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">PG</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-md text-[var(--color-charcoal-400)] hover:text-white hover:bg-[var(--color-charcoal-800)]/10 transition-colors ${collapsed ? "mx-auto mt-3" : "shrink-0"}`}
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`admin-sidebar-item ${active ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${active ? "text-[var(--color-brand-300)]" : ""}`}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          title={collapsed ? "Sign Out" : undefined}
          className={`admin-sidebar-item w-full hover:bg-red-500/10 hover:text-red-400 ${collapsed ? "justify-center px-2" : ""}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}


