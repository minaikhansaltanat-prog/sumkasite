"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Row {
  id: string;
  sku: string;
  nameKaz: string;
  price: number;
  isPublished: boolean;
  category: { nameKaz: string };
  supplier: { name: string } | null;
  images: { thumbUrl: string | null; url: string }[];
}

interface SupplierOption {
  id: string;
  name: string;
  productCount: number;
}

export function ProductsTable({ products, suppliers = [] }: { products: Row[]; suppliers?: SupplierOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState(searchParams.get("search") || "");

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((s) => (s.size === products.length ? new Set() : new Set(products.map((p) => p.id))));
  }

  function search_() {
    const next = new URLSearchParams(searchParams.toString());
    if (search) next.set("search", search);
    else next.delete("search");
    router.push(`${pathname}?${next.toString()}`);
  }

  function filterBySupplier(supplierId: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (supplierId) next.set("supplier", supplierId);
    else next.delete("supplier");
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  }

  async function bulk(action: "publish" | "unpublish" | "delete") {
    if (selected.size === 0) return;
    if (action === "delete" && !confirm(`${selected.size} өнімді жою керек пе?`)) return;
    await fetch("/api/products/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected), action }),
    });
    setSelected(new Set());
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Өнімді жою керек пе?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
        <div className="flex gap-2 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search_()}
            placeholder="Артикул немесе атауы бойынша іздеу"
            className="h-10 px-3 rounded-card border border-line w-64 outline-none focus:border-gold"
          />
          <button onClick={search_} className="btn-secondary h-10 text-xs">Іздеу</button>
          {suppliers.length > 0 && (
            <select
              value={searchParams.get("supplier") || ""}
              onChange={(e) => filterBySupplier(e.target.value)}
              className="h-10 px-3 rounded-card border border-line text-sm outline-none focus:border-gold"
            >
              <option value="">Барлық жеткізушілер</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.productCount})</option>
              ))}
            </select>
          )}
        </div>
        <Link href="/admin/products/new" className="btn-primary">+ Жаңа сумка қосу</Link>
      </div>

      {selected.size > 0 && (
        <div className="flex gap-2 items-center mb-3 bg-cream px-4 py-2 rounded-card text-sm">
          <span>{selected.size} таңдалды</span>
          <button onClick={() => bulk("publish")} className="text-gold">Жариялау</button>
          <button onClick={() => bulk("unpublish")} className="text-ink-muted">Жасыру</button>
          <button onClick={() => bulk("delete")} className="text-danger">Жою</button>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-muted border-b border-line">
              <th className="py-3 px-3"><input type="checkbox" checked={selected.size === products.length && products.length > 0} onChange={toggleAll} /></th>
              <th className="py-3 px-3">Сурет</th>
              <th className="py-3 px-3">Артикул</th>
              <th className="py-3 px-3">Атауы</th>
              <th className="py-3 px-3">Категория</th>
              <th className="py-3 px-3">Жеткізуші</th>
              <th className="py-3 px-3">Баға</th>
              <th className="py-3 px-3">Күй</th>
              <th className="py-3 px-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line/60">
                <td className="py-2 px-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggle(p.id)} /></td>
                <td className="py-2 px-3">
                  <div className="relative w-12 h-12 rounded-card overflow-hidden bg-cream">
                    {p.images[0] && <Image src={p.images[0].thumbUrl || p.images[0].url} alt="" fill className="object-cover" />}
                  </div>
                </td>
                <td className="py-2 px-3 price-mono text-xs">{p.sku}</td>
                <td className="py-2 px-3 max-w-xs truncate">{p.nameKaz}</td>
                <td className="py-2 px-3 text-ink-muted">{p.category.nameKaz}</td>
                <td className="py-2 px-3 text-ink-muted">{p.supplier?.name || "—"}</td>
                <td className="py-2 px-3 price-mono text-gold">{p.price.toLocaleString("ru-RU")}</td>
                <td className="py-2 px-3">
                  <span className={`label-tag px-2 py-1 rounded ${p.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.isPublished ? "Жарияланған" : "Жасырын"}
                  </span>
                </td>
                <td className="py-2 px-3 flex gap-2 whitespace-nowrap">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-gold">Өзгерту</Link>
                  <button onClick={() => remove(p.id)} className="text-danger">Жою</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={9} className="py-8 text-center text-ink-muted">Өнім табылмады</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
