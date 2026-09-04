interface StatsItem {
  value: string;
  label: string;
}

interface StatsSectionProps {
  stats?: StatsItem[];
}

const defaultStats: StatsItem[] = [
  { value: "500+", label: "Successful Transactions" },
  { value: "1,200+", label: "Properties Listed" },
  { value: "800+", label: "Happy Clients" },
  { value: "10+", label: "Years Experience" },
];

export default function StatsSection({ stats = defaultStats }: StatsSectionProps) {
  return (
    <section className="py-14 bg-[var(--color-brand-500)]">
      <div className="container-site">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="heading-display text-white text-4xl lg:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-white/80 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
