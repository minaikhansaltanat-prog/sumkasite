"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { clsx } from "clsx";
import { useLang } from "@/components/layout/LangProvider";
import { ChevronRight, ChevronDown, WhatsAppIcon, FlameIcon } from "@/components/ui/icons";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export interface FilterCategory {
  slug: string;
  nameKaz: string;
  nameRus: string;
  totalCount?: number;
  children?: FilterCategory[];
}

export interface SidebarBestseller {
  slug: string;
  nameKaz: string;
  nameRus: string;
  price: number;
  images: { url: string; thumbUrl: string | null }[];
}

export function FilterSidebar({
  categories,
  materials,
  bestsellers = [],
}: {
  categories: FilterCategory[];
  materials: string[];
  bestsellers?: SidebarBestseller[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { lang, t } = useLang();
  const [, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(
    categories.find((c) => c.children?.some((s) => s.slug === searchParams.get("category")))?.slug ?? null
  );

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

  const categoriesWidget = (
    <div className="widget">
      <div className="widget-title">{t("ui", "categoriesWidgetTitle")}</div>
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => update({ category: "" })}
          className={clsx(
            "group flex items-center justify-between text-left text-sm py-2 px-2 rounded transition-colors",
            !current.category ? "bg-gold/10 text-gold font-bold" : "text-ink-text hover:bg-cream"
          )}
        >
          {t("catalog", "allCategories")}
          <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
        </button>
        {categories.map((c) => {
          const hasChildren = !!c.children?.length;
          const isExpanded = expanded === c.slug;
          return (
            <div key={c.slug}>
              <div className="flex items-center">
                <button
                  onClick={() => update({ category: c.slug })}
                  className={clsx(
                    "group flex-1 flex items-center justify-between text-left text-sm py-2 px-2 rounded transition-colors",
                    current.category === c.slug ? "bg-gold/10 text-gold font-bold" : "text-ink-text hover:bg-cream"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {lang === "kk" ? c.nameKaz : c.nameRus}
                    {c.totalCount === 0 && <span className="text-[10px] text-gold normal-case">жақын­да</span>}
                  </span>
                  {!hasChildren && <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />}
                </button>
                {hasChildren && (
                  <button
                    aria-label="Ішкі санаттар"
                    onClick={() => setExpanded((cur) => (cur === c.slug ? null : c.slug))}
                    className="p-2 cursor-pointer text-ink-muted"
                  >
                    <ChevronDown className={clsx("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-180")} />
                  </button>
                )}
              </div>
              {hasChildren && isExpanded && (
                <div className="flex flex-col pl-3 border-l border-line ml-2 mb-1">
                  {c.children!.map((sub) => (
                    <button
                      key={sub.slug}
                      onClick={() => update({ category: sub.slug })}
                      className={clsx(
                        "text-left text-xs py-1.5 px-2 rounded transition-colors",
                        current.category === sub.slug ? "text-gold font-bold" : "text-ink-muted hover:text-ink-text"
                      )}
                    >
                      {lang === "kk" ? sub.nameKaz : sub.nameRus}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const filtersWidget = (
    <div className="widget">
      <div className="widget-title">{t("catalog", "filterSort")}</div>
      <div className="flex flex-col gap-5">
        <div>
          <div className="label-tag mb-2">{t("catalog", "filterPrice")}</div>
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
            <div className="label-tag mb-2">{t("product", "material")}</div>
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
          <div className="label-tag mb-2">{t("catalog", "filterSort")}</div>
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
    </div>
  );

  const quickOrderWidget = (
    <div className="widget bg-ink text-white border-ink">
      <div className="flex items-center gap-2 mb-2">
        <WhatsAppIcon className="w-5 h-5 text-gold-light" />
        <div className="font-display text-sm font-bold uppercase tracking-[0.08em]">{t("ui", "quickOrderTitle")}</div>
      </div>
      <p className="text-xs text-white/70 mb-4">{t("ui", "quickOrderDesc")}</p>
      <a href={buildGeneralWhatsAppLink()} target="_blank" rel="noopener" className="btn-primary w-full h-10 text-xs">
        {t("home", "ctaWhatsapp")}
      </a>
    </div>
  );

  const bestsellersWidget = bestsellers.length > 0 && (
    <div className="widget">
      <div className="widget-title flex items-center gap-1.5">
        <FlameIcon className="w-4 h-4 text-gold" />
        {t("ui", "bestsellersTitle")}
      </div>
      <div className="flex flex-col gap-3">
        {bestsellers.map((b) => {
          const img = b.images[0];
          return (
            <Link key={b.slug} href={`/catalog/${b.slug}`} className="flex items-center gap-3 group">
              <div className="relative w-14 h-14 shrink-0 rounded-card overflow-hidden bg-cream">
                {img && (
                  <Image src={img.thumbUrl || img.url} alt="" fill className="object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-ink-text line-clamp-2 group-hover:text-gold transition-colors">
                  {lang === "kk" ? b.nameKaz : b.nameRus}
                </div>
                <div className="price-mono text-xs text-gold font-bold mt-0.5">
                  {b.price.toLocaleString("ru-RU")} {t("catalog", "perDana")}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );

  const content = (
    <div className="flex flex-col gap-4">
      {categoriesWidget}
      {filtersWidget}
    </div>
  );

  return (
    <>
      <div className="lg:hidden mb-4">
        <button onClick={() => setMobileOpen(true)} className="btn-secondary h-11 w-full">
          {t("catalog", "filterCategory")} / {t("catalog", "filterSort")}
        </button>
      </div>

      <aside className="hidden lg:flex w-72 shrink-0 sticky top-28 self-start flex-col gap-4">
        {categoriesWidget}
        {quickOrderWidget}
        {bestsellersWidget}
        {filtersWidget}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 bg-white rounded-b-2xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="font-display text-lg font-bold">Сүзгі</span>
              <button onClick={() => setMobileOpen(false)} className="text-ink-muted text-2xl leading-none cursor-pointer">
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
