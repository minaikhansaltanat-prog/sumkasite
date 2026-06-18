"use client";

import { useLang } from "@/components/layout/LangProvider";

export function CatalogHeading({ total }: { total: number }) {
  const { t } = useLang();
  return (
    <div>
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-text">{t("catalog", "title")}</h1>
      <p className="text-ink-muted mt-2">
        {t("catalog", "subtitle")} · {total} SKU
      </p>
    </div>
  );
}
