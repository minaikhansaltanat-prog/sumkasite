"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { useLang } from "@/components/layout/LangProvider";
import { WhatsAppIcon, ChevronLeft, ChevronRight } from "@/components/ui/icons";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export function Hero({ images }: { images: string[] }) {
  const { t } = useLang();
  const slides = images.slice(0, 5);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  function go(dir: 1 | -1) {
    setActive((a) => (a + dir + slides.length) % slides.length);
  }

  return (
    <section className="relative bg-gradient-to-br from-ink via-ink to-ink-soft overflow-hidden">
      <div className="container-page grid lg:grid-cols-2 gap-10 py-14 sm:py-20 items-center relative z-10">
        <div>
          <span className="label-tag text-gold-light font-bold">SAMGA — B2B каталог</span>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white mt-4 leading-tight text-balance">
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

        {slides.length > 0 && (
          <div className="relative aspect-[4/3] rounded-card overflow-hidden border border-white/10">
            {slides.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt="SAMGA сумка"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={clsx(
                  "object-cover transition-opacity duration-700",
                  i === active ? "opacity-100" : "opacity-0"
                )}
                priority={i === 0}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-text/40 via-transparent to-transparent" />

            {slides.length > 1 && (
              <>
                <button
                  aria-label="Алдыңғы"
                  onClick={() => go(-1)}
                  className="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-ink flex items-center justify-center hover:bg-gold hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  aria-label="Келесі"
                  onClick={() => go(1)}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-ink flex items-center justify-center hover:bg-gold hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Слайд ${i + 1}`}
                      onClick={() => setActive(i)}
                      className={clsx(
                        "cursor-pointer h-1.5 rounded-full transition-all",
                        i === active ? "w-6 bg-gold-light" : "w-1.5 bg-white/50"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
