"use client";

import React from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg?: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  href?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconBg = "bg-blue-50",
  change,
  changeType = "neutral",
}: StatsCardProps) {
  const changeColor =
    changeType === "up"
      ? "text-emerald-600"
      : changeType === "down"
        ? "text-red-500"
        : "text-charcoal-500";

  return (
    <div className="bg-[var(--color-charcoal-800)] rounded-xl shadow-[var(--shadow-card)] p-5 flex items-start gap-4 hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-200">
      <div
        className={`${iconBg} rounded-lg p-3 flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-charcoal-400)] mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-white leading-tight">
          {value}
        </p>
        {change && (
          <p className={`text-xs mt-1 font-medium ${changeColor}`}>{change}</p>
        )}
      </div>
    </div>
  );
}
