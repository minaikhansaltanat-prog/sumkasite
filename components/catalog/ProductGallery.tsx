"use client";

import Image from "next/image";
import { clsx } from "clsx";
import { useState, useRef } from "react";
import { CloseIcon } from "@/components/ui/icons";

export function ProductGallery({
  images,
  alt,
}: {
  images: { url: string; thumbUrl: string | null }[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const safeImages = images.length > 0 ? images : [{ url: "", thumbUrl: null }];

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      setActive((a) => {
        if (diff < 0) return Math.min(a + 1, safeImages.length - 1);
        return Math.max(a - 1, 0);
      });
    }
    touchStartX.current = null;
  }

  return (
    <div>
      <div
        className="relative aspect-square bg-cream rounded-card overflow-hidden cursor-zoom-in"
        onClick={() => setLightbox(true)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {safeImages[active].url ? (
          <Image
            src={safeImages[active].url}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-muted">Сурет жоқ</div>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={clsx(
                "relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-card overflow-hidden border-2",
                active === i ? "border-gold" : "border-line"
              )}
            >
              {img.thumbUrl && <Image src={img.thumbUrl} alt="" fill className="object-cover" />}
            </button>
          ))}
        </div>
      )}

      {lightbox && safeImages[active].url && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-4 right-4 text-white" onClick={() => setLightbox(false)}>
            <CloseIcon className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-3xl aspect-square">
            <Image src={safeImages[active].url} alt={alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
