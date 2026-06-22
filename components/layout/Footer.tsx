"use client";

import Link from "next/link";
import { useLang } from "./LangProvider";
import { getWhatsAppNumber, getPhoneNumber } from "@/lib/whatsapp";
import { PhoneIcon, ClockIcon, WhatsAppIcon } from "@/components/ui/icons";

export interface FooterCategory {
  slug: string;
  nameKaz: string;
  nameRus: string;
}

export function Footer({ categories = [] }: { categories?: FooterCategory[] }) {
  const { lang, t } = useLang();
  const whatsapp = getWhatsAppNumber();

  return (
    <footer className="bg-ink text-white/70 mt-20">
      <div className="container-page py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-2xl font-extrabold text-white mb-3">SAMGA</div>
          <p className="text-sm leading-relaxed max-w-xs">
            Қазақстандағы оптом сумка каталогы. Сенімді жеткізуші, кіші бумадан тапсырыс.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs text-white/50">
            <ClockIcon className="w-4 h-4 text-gold-light" />
            {t("footer", "workHours")}
          </div>
        </div>

        <div>
          <div className="label-tag text-gold-light mb-4 font-bold">{t("footer", "colAbout")}</div>
          <nav className="flex flex-col gap-2.5 text-sm">
            <Link href="/" className="hover:text-white transition-colors">{t("nav", "home")}</Link>
            <Link href="/catalog" className="hover:text-white transition-colors">{t("nav", "catalog")}</Link>
            <Link href="/wholesale" className="hover:text-white transition-colors">{t("nav", "wholesale")}</Link>
            <Link href="/contact" className="hover:text-white transition-colors">{t("nav", "contact")}</Link>
          </nav>
        </div>

        <div>
          <div className="label-tag text-gold-light mb-4 font-bold">{t("footer", "colCategories")}</div>
          <nav className="flex flex-col gap-2.5 text-sm">
            {categories.slice(0, 5).map((c) => (
              <Link key={c.slug} href={`/catalog?category=${c.slug}`} className="hover:text-white transition-colors">
                {lang === "kk" ? c.nameKaz : c.nameRus}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <div className="label-tag text-gold-light mb-4 font-bold">{t("footer", "colContact")}</div>
          <div className="flex flex-col gap-2.5 text-sm">
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white transition-colors">
              <WhatsAppIcon className="w-4 h-4 text-gold-light shrink-0" />
              +{whatsapp.replace(/(\d)(?=(\d{3})+$)/g, "$1 ")}
            </a>
            <a href={`tel:${getPhoneNumber()}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <PhoneIcon className="w-4 h-4 text-gold-light shrink-0" />
              {getPhoneNumber()}
            </a>
            <a href="mailto:minaikhan.saltanat@gmail.com" className="hover:text-white transition-colors">
              minaikhan.saltanat@gmail.com
            </a>
            <span>{t("footer", "address")}, Қазақстан</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-page flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40">
          <span>© 2026 SAMGA. {t("footer", "rights")}</span>
          <span>SKU, бағалар сайтта көрсетіледі — соңғы баға менеджермен нақтыланады</span>
        </div>
      </div>
    </footer>
  );
}
