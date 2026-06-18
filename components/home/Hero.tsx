"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/layout/LangProvider";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export function Hero({ images }: { images: string[] }) {
  const { t } = useLang();

  return (
    <section className="relative bg-ink overflow-hidden">
      <div className="container-page grid lg:grid-cols-2 gap-10 py-16 sm:py-24 items-center relative z-10">
        <div>
          <span className="label-tag text-gold">SAMGA — B2B каталог</span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white mt-4 leading-tight text-balance">
            {t("home", "heroTitle")}
          </h1>
          <p className="text-white/70 mt-5 text-base sm:text-lg max-w-md">{t("home", "heroSubtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/catalog" className="btn-primary">
              {t("home", "ctaCatalog")}
            </Link>
            <a
              href={buildGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener"
              className="btn-secondary gap-2 !border-white/30 !text-white hover:!bg-white hover:!text-ink"
            >
              <WhatsAppIcon className="w-5 h-5" />
              {t("home", "ctaWhatsapp")}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {images.slice(0, 3).map((src, i) => (
            <div
              key={src}
              className={`relative aspect-[3/4] rounded-card overflow-hidden ${i === 1 ? "translate-y-4" : ""}`}
            >
              <Image src={src} alt="SAMGA сумка" fill className="object-cover" priority={i === 0} />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60 pointer-events-none" />
    </section>
  );
}
