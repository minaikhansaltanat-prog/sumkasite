"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function go(p: number) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", String(p));
    router.push(`${pathname}?${next.toString()}`);
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        className="h-10 w-10 flex items-center justify-center rounded-card border border-line disabled:opacity-30"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-ink-muted">…</span>}
          <button
            onClick={() => go(p)}
            className={clsx(
              "h-10 w-10 rounded-card text-sm font-medium",
              p === page ? "bg-gold text-white" : "border border-line hover:border-gold"
            )}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
        className="h-10 w-10 flex items-center justify-center rounded-card border border-line disabled:opacity-30"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
