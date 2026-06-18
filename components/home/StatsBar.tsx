"use client";

import { useLang } from "@/components/layout/LangProvider";

export function StatsBar({ productCount }: { productCount: number }) {
  const { t } = useLang();
  const stats = [
    { value: `${productCount}+`, label: t("home", "statModels") },
    { value: "5+", label: t("home", "statYears") },
    { value: "ҚР", label: t("home", "statDelivery") },
    { value: "10", label: t("home", "statMinOrder") },
  ];

  return (
    <section className="bg-ink-soft">
      <div className="container-page grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
        {stats.map((s) => (
          <div key={s.label} className="py-7 text-center px-2">
            <div className="font-display text-2xl sm:text-3xl font-bold text-gold">{s.value}</div>
            <div className="text-xs sm:text-sm text-white/60 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
