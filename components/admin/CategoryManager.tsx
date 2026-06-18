"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SingleImageUpload } from "./SingleImageUpload";

interface Category {
  id: string;
  slug: string;
  nameKaz: string;
  nameRus: string;
  imageUrl: string | null;
  order: number;
  _count?: { products: number };
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  async function remove(id: string) {
    if (!confirm("Категорияны жою керек пе?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Қате орын алды");
      return;
    }
    router.refresh();
  }

  async function move(cat: Category, dir: -1 | 1) {
    const idx = categories.findIndex((c) => c.id === cat.id);
    const target = categories[idx + dir];
    if (!target) return;
    await Promise.all([
      fetch(`/api/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: target.order }),
      }),
      fetch(`/api/categories/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: cat.order }),
      }),
    ]);
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold">Категориялар</h1>
        <button onClick={() => setCreating(true)} className="btn-primary">+ Жаңа категория</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c, i) => (
          <div key={c.id} className="card p-4 flex gap-3">
            <div className="relative w-16 h-16 rounded-card overflow-hidden bg-cream shrink-0">
              {c.imageUrl && <Image src={c.imageUrl} alt="" fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{c.nameKaz}</div>
              <div className="text-sm text-ink-muted">{c.nameRus}</div>
              <div className="text-xs text-ink-muted mt-1">{c._count?.products ?? 0} өнім</div>
              <div className="flex gap-2 mt-2 text-xs">
                <button onClick={() => move(c, -1)} disabled={i === 0} className="text-ink-muted disabled:opacity-30">↑</button>
                <button onClick={() => move(c, 1)} disabled={i === categories.length - 1} className="text-ink-muted disabled:opacity-30">↓</button>
                <button onClick={() => setEditing(c)} className="text-gold">Өзгерту</button>
                <button onClick={() => remove(c.id)} className="text-danger">Жою</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <CategoryFormModal
          category={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setCreating(false);
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function CategoryFormModal({
  category,
  onClose,
  onSaved,
}: {
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nameKaz, setNameKaz] = useState(category?.nameKaz ?? "");
  const [nameRus, setNameRus] = useState(category?.nameRus ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(category?.imageUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    setError(null);
    const url = category ? `/api/categories/${category.id}` : "/api/categories";
    const method = category ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameKaz, nameRus, imageUrl }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Қате орын алды");
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-card p-6 w-full max-w-md">
        <h2 className="font-display text-lg font-bold mb-4">{category ? "Категорияны өзгерту" : "Жаңа категория"}</h2>
        <div className="flex flex-col gap-3">
          <SingleImageUpload value={imageUrl} onChange={setImageUrl} />
          <input
            placeholder="Атауы (қаз)"
            value={nameKaz}
            onChange={(e) => setNameKaz(e.target.value)}
            className="h-11 px-3 rounded-card border border-line focus:border-gold outline-none"
          />
          <input
            placeholder="Атауы (рус)"
            value={nameRus}
            onChange={(e) => setNameRus(e.target.value)}
            className="h-11 px-3 rounded-card border border-line focus:border-gold outline-none"
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          <div className="flex gap-2 mt-2">
            <button onClick={submit} disabled={saving} className="btn-primary flex-1">Сақтау</button>
            <button onClick={onClose} className="btn-secondary flex-1">Бас тарту</button>
          </div>
        </div>
      </div>
    </div>
  );
}
