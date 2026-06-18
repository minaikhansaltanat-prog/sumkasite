"use client";

import { useLang } from "@/components/layout/LangProvider";

export function AdvantagesSection() {
  const { t } = useLang();
  const items = [
    { title: t("home", "advTitle1"), desc: t("home", "advDesc1") },
    { title: t("home", "advTitle2"), desc: t("home", "advDesc2") },
    { title: t("home", "advTitle3"), desc: t("home", "advDesc3") },
  ];
  return (
    <section className="container-page py-16">
      <div className="grid sm:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.title} className="text-center px-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-gold/15 flex items-center justify-center mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-gold" />
            </div>
            <h3 className="font-display text-lg font-bold">{item.title}</h3>
            <p className="text-ink-muted mt-2 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
