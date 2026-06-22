"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import { useLang } from "./LangProvider";
import { MenuIcon, CloseIcon, SearchIcon, WhatsAppIcon } from "@/components/ui/icons";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

const links = [
  { href: "/", section: "home" as const, key: "home" as const },
  { href: "/catalog", section: "nav" as const, key: "catalog" as const },
  { href: "/wholesale", section: "nav" as const, key: "wholesale" as const },
  { href: "/contact", section: "nav" as const, key: "contact" as const },
];

export interface HeaderCategory {
  slug: string;
  nameKaz: string;
  nameRus: string;
}

export function Header({ categories = [] }: { categories?: HeaderCategory[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = (new FormData(e.currentTarget).get("q") as string)?.trim();
    router.push(value ? `/catalog?search=${encodeURIComponent(value)}` : "/catalog");
  }

  return (
    <header className="sticky top-0 z-50 bg-ink text-white shadow-lg shadow-ink/10">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl sm:text-2xl font-extrabold tracking-wide text-white shrink-0">
          SAMGA
        </Link>

        <nav className="hidden lg:flex items-center gap-7 shrink-0">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "text-sm font-bold tracking-wide uppercase transition-colors hover:text-gold-light",
                pathname === l.href ? "text-gold-light" : "text-white/85"
              )}
            >
              {l.key === "home" ? t("nav", "home") : t("nav", l.key)}
            </Link>
          ))}
        </nav>

        <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="flex w-full items-center bg-white/10 rounded-card border border-white/15 focus-within:border-gold-light transition-colors">
            <SearchIcon className="w-4 h-4 ml-3 text-white/50 shrink-0" />
            <input
              name="q"
              type="search"
              placeholder={t("ui", "searchPlaceholder")}
              className="w-full bg-transparent px-2.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none"
            />
          </div>
        </form>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <a
            href={buildGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 h-10 px-4 rounded-card bg-gold text-white text-xs font-bold uppercase tracking-wide hover:bg-gold-light transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4" />
            {t("home", "ctaWhatsapp")}
          </a>
          <LangToggle lang={lang} setLang={setLang} />
        </div>

        <button aria-label="Menu" className="lg:hidden p-2 text-white cursor-pointer" onClick={() => setOpen((v) => !v)}>
          {open ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {categories.length > 0 && (
        <div className="hidden lg:block border-t border-white/10 bg-ink-soft">
          <div className="container-page flex items-center gap-6 h-11 overflow-x-auto">
            <Link
              href="/catalog"
              className="text-xs font-bold uppercase tracking-wide text-gold-light whitespace-nowrap"
            >
              {t("ui", "allCategoriesLinkAll")}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/catalog?category=${c.slug}`}
                className="text-xs font-semibold uppercase tracking-wide text-white/75 hover:text-gold-light whitespace-nowrap transition-colors"
              >
                {lang === "kk" ? c.nameKaz : c.nameRus}
              </Link>
            ))}
          </div>
        </div>
      )}

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-ink">
          <nav className="container-page flex flex-col gap-1 py-4">
            <form onSubmit={onSearch} className="mb-3">
              <div className="flex items-center bg-white/10 rounded-card border border-white/15">
                <SearchIcon className="w-4 h-4 ml-3 text-white/50 shrink-0" />
                <input
                  name="q"
                  type="search"
                  placeholder={t("ui", "searchPlaceholder")}
                  className="w-full bg-transparent px-2.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none"
                />
              </div>
            </form>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "py-3 text-base font-semibold uppercase tracking-wide border-b border-white/5",
                  pathname === l.href ? "text-gold-light" : "text-white/85"
                )}
              >
                {l.key === "home" ? t("nav", "home") : t("nav", l.key)}
              </Link>
            ))}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 py-3 border-b border-white/5">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/catalog?category=${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="text-xs font-semibold uppercase px-2.5 py-1.5 rounded-full bg-white/10 text-white/80"
                  >
                    {lang === "kk" ? c.nameKaz : c.nameRus}
                  </Link>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between pt-4">
              <LangToggle lang={lang} setLang={setLang} />
              <Link href="/admin/login" className="text-xs uppercase tracking-wide text-white/60">
                {t("nav", "admin")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function LangToggle({ lang, setLang }: { lang: "kk" | "ru"; setLang: (l: "kk" | "ru") => void }) {
  return (
    <div className="flex items-center rounded-full border border-white/20 text-xs font-semibold overflow-hidden">
      <button
        onClick={() => setLang("kk")}
        className={clsx("px-3 py-1.5 transition-colors", lang === "kk" ? "bg-gold text-white" : "text-white/70")}
      >
        ҚАЗ
      </button>
      <button
        onClick={() => setLang("ru")}
        className={clsx("px-3 py-1.5 transition-colors", lang === "ru" ? "bg-gold text-white" : "text-white/70")}
      >
        РУС
      </button>
    </div>
  );
}
