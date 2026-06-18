"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { useLang } from "@/components/layout/LangProvider";

export interface FilterCategory {
  slug: string;
  nameKaz: string;
  nameRus: string;
}

export function FilterSidebar({
  categories,
  materials,
}: {
  categories: FilterCategory[];
  materials: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang, t } = useLang();
  const [, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = {
    category: searchParams.get("category") || "",
    min: searchParams.get("min") || "",
    max: searchParams.get("max") || "",
    material: searchParams.get("material") || "",
    sort: searchParams.get("sort") || "new",
  };

  function update(params: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page");
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  }

  function reset() {
    startTransition(() => router.push(pathname));
  }

  const content = (
    <div className="flex flex-col gap-6">
      <div>
        <div className="label-tag mb-3">{t("catalog", "filterCategory")}</div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => update({ category: "" })}
            className={clsx(
              "text-left text-sm py-1.5 px-2 rounded transition-colors",
              !current.category ? "bg-gold/15 text-gold font-semibold" : "text-ink-text hover:bg-cream"
            )}
          >
            {t("catalog", "allCategories")}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => update({ category: c.slug })}
              className={clsx(
                "text-left text-sm py-1.5 px-2 rounded transition-colors",
                current.category === c.slug ? "bg-gold/15 text-gold font-semibold" : "text-ink-text hover:bg-cream"
              )}
            >
              {lang === "kk" ? c.nameKaz : c.nameRus}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="label-tag mb-3">{t("catalog", "filterPrice")}</div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="500"
            defaultValue={current.min}
            onBlur={(e) => update({ min: e.target.value })}
            className="w-full h-10 px-3 rounded-card border border-line text-sm focus:border-gold outline-none"
          />
          <span className="text-ink-muted">—</span>
          <input
            type="number"
            placeholder="15000"
            defaultValue={current.max}
            onBlur={(e) => update({ max: e.target.value })}
            className="w-full h-10 px-3 rounded-card border border-line text-sm focus:border-gold outline-none"
          />
        </div>
      </div>

      {materials.length > 0 && (
        <div>
          <div className="label-tag mb-3">{t("product", "material")}</div>
          <select
            value={current.material}
            onChange={(e) => update({ material: e.target.value })}
            className="w-full h-10 px-3 rounded-card border border-line text-sm focus:border-gold outline-none"
          >
            <option value="">{t("catalog", "allCategories")}</option>
            {materials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <div className="label-tag mb-3">{t("catalog", "filterSort")}</div>
        <select
          value={current.sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="w-full h-10 px-3 rounded-card border border-line text-sm focus:border-gold outline-none"
        >
          <option value="new">{t("catalog", "sortNew")}</option>
          <option value="price_asc">{t("catalog", "sortPriceAsc")}</option>
          <option value="price_desc">{t("catalog", "sortPriceDesc")}</option>
          <option value="hit">{t("catalog", "sortHit")}</option>
        </select>
      </div>

      <button onClick={reset} className="btn-secondary h-10 text-xs">
        {t("catalog", "resetFilters")}
      </button>
    </div>
  );

  return (
    <>
      <div className="lg:hidden mb-4">
        <button onClick={() => setMobileOpen(true)} className="btn-secondary h-11 w-full">
          {t("catalog", "filterCategory")} / {t("catalog", "filterSort")}
        </button>
      </div>

      <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start bg-cream rounded-card p-5">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 bg-white rounded-b-2xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="font-display text-lg font-bold">Сүзгі</span>
              <button onClick={() => setMobileOpen(false)} className="text-ink-muted text-2xl leading-none">
                ×
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
