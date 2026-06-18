"use client";

import { useLang } from "@/components/layout/LangProvider";

export function RelatedHeading() {
  const { lang } = useLang();
  return (
    <h2 className="font-display text-2xl font-bold">
      {lang === "kk" ? "Ұқсас сумкалар" : "Похожие товары"}
    </h2>
  );
}
