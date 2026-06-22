"use client";

import { useLang } from "@/components/layout/LangProvider";
import { BoxIcon, TruckIcon, ShieldIcon } from "@/components/ui/icons";

export function AdvantagesSection() {
  const { t } = useLang();
  const items = [
    { title: t("home", "advTitle1"), desc: t("home", "advDesc1"), Icon: BoxIcon },
    { title: t("home", "advTitle2"), desc: t("home", "advDesc2"), Icon: TruckIcon },
    { title: t("home", "advTitle3"), desc: t("home", "advDesc3"), Icon: ShieldIcon },
  ];
  return (
    <section className="bg-cream border-y border-line">
      <div className="container-page py-8 grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line">
        {items.map(({ title, desc, Icon }) => (
          <div key={title} className="flex items-center gap-4 py-4 sm:py-0 sm:px-6 first:sm:pl-0">
            <div className="w-11 h-11 shrink-0 rounded-full bg-gold/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-ink-text">{title}</h3>
              <p className="text-ink-muted text-xs mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
