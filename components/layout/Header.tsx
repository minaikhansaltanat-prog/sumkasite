"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import { useLang } from "./LangProvider";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";

const links = [
  { href: "/", section: "home" as const, key: "home" as const },
  { href: "/catalog", section: "nav" as const, key: "catalog" as const },
  { href: "/wholesale", section: "nav" as const, key: "wholesale" as const },
  { href: "/contact", section: "nav" as const, key: "contact" as const },
];

export function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ink text-white">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold tracking-wide text-white">
          SAMGA
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "text-sm font-semibold tracking-wide uppercase transition-colors hover:text-gold",
                pathname === l.href ? "text-gold" : "text-white/85"
              )}
            >
              {l.key === "home" ? t("nav", "home") : t("nav", l.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <LangToggle lang={lang} setLang={setLang} />
          <Link href="/admin/login" className="text-xs uppercase tracking-wide text-white/60 hover:text-gold">
            {t("nav", "admin")}
          </Link>
        </div>

        <button
          aria-label="Menu"
          className="lg:hidden p-2 text-white"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-ink">
          <nav className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "py-3 text-base font-semibold uppercase tracking-wide border-b border-white/5",
                  pathname === l.href ? "text-gold" : "text-white/85"
                )}
              >
                {l.key === "home" ? t("nav", "home") : t("nav", l.key)}
              </Link>
            ))}
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
        className={clsx("px-3 py-1.5 transition-colors", lang === "kk" ? "bg-gold text-ink" : "text-white/70")}
      >
        ҚАЗ
      </button>
      <button
        onClick={() => setLang("ru")}
        className={clsx("px-3 py-1.5 transition-colors", lang === "ru" ? "bg-gold text-ink" : "text-white/70")}
      >
        РУС
      </button>
    </div>
  );
}
