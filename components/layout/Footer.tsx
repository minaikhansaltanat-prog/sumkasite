"use client";

import Link from "next/link";
import { useLang } from "./LangProvider";
import { getWhatsAppNumber } from "@/lib/whatsapp";

export function Footer() {
  const { t } = useLang();
  const whatsapp = getWhatsAppNumber();

  return (
    <footer className="bg-ink text-white/70 mt-20">
      <div className="container-page py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="font-display text-2xl font-bold text-white mb-2">SAMGA</div>
          <p className="text-sm leading-relaxed">
            Қазақстандағы оптом сумка каталогы. Сенімді жеткізуші, кіші бумадан тапсырыс.
          </p>
        </div>

        <div>
          <div className="label-tag text-gold mb-3">Навигация</div>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/" className="hover:text-gold">{t("nav", "home")}</Link>
            <Link href="/catalog" className="hover:text-gold">{t("nav", "catalog")}</Link>
            <Link href="/wholesale" className="hover:text-gold">{t("nav", "wholesale")}</Link>
            <Link href="/contact" className="hover:text-gold">{t("nav", "contact")}</Link>
          </nav>
        </div>

        <div>
          <div className="label-tag text-gold mb-3">Байланыс</div>
          <div className="flex flex-col gap-2 text-sm">
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" className="hover:text-gold">
              WhatsApp: +{whatsapp.replace(/(\d)(?=(\d{3})+$)/g, "$1 ")}
            </a>
            <a href="mailto:minaikhan.saltanat@gmail.com" className="hover:text-gold">
              minaikhan.saltanat@gmail.com
            </a>
          </div>
        </div>

        <div>
          <div className="label-tag text-gold mb-3">{t("footer", "address")}</div>
          <p className="text-sm">Алматы, Қазақстан</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-page text-xs text-white/40">
          © 2026 SAMGA. {t("footer", "rights")}
        </div>
      </div>
    </footer>
  );
}
