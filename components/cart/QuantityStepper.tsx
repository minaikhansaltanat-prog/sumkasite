"use client";

import { MinusIcon, PlusIcon } from "@/components/ui/icons";

export function QuantityStepper({
  value,
  min = 1,
  onChange,
  size = "md",
}: {
  value: number;
  min?: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-9" : "h-11";
  const btnW = size === "sm" ? "w-9" : "w-11";

  return (
    <div className={`flex items-center ${h} border border-line rounded-card overflow-hidden`}>
      <button
        type="button"
        aria-label="Азайту"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${btnW} h-full flex items-center justify-center text-ink-muted hover:bg-cream disabled:opacity-30 cursor-pointer`}
      >
        <MinusIcon className="w-3.5 h-3.5" />
      </button>
      <input
        type="number"
        value={value}
        min={min}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || min))}
        className="w-14 h-full text-center text-sm font-semibold outline-none price-mono"
      />
      <button
        type="button"
        aria-label="Көбейту"
        onClick={() => onChange(value + 1)}
        className={`${btnW} h-full flex items-center justify-center text-ink-muted hover:bg-cream cursor-pointer`}
      >
        <PlusIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
