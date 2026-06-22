"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SingleImageUpload } from "./SingleImageUpload";

interface CategoryNode {
  id: string;
  slug: string;
  nameKaz: string;
  nameRus: string;
  imageUrl: string | null;
  productCount: number;
  totalCount: number;
  children: CategoryNode[];
}

type ModalState =
  | { mode: "create-main" }
  | { mode: "create-sub"; parentId: string; parentName: string }
  | { mode: "edit"; category: CategoryNode }
  | null;

export function CategoryManager({ tree }: { tree: CategoryNode[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>(null);

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

  async function move(list: CategoryNode[], item: CategoryNode, dir: -1 | 1) {
    const idx = list.findIndex((c) => c.id === item.id);
    const target = list[idx + dir];
    if (!target) return;
    await Promise.all([
      fetch(`/api/categories/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: idx + dir }),
      }),
      fetch(`/api/categories/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: idx }),
      }),
    ]);
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-bold">Категориялар</h1>
        <button onClick={() => setModal({ mode: "create-main" })} className="btn-primary">
          + Жаңа категория
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {tree.map((main, i) => (
          <div key={main.id} className="card p-5">
            <div className="flex gap-4">
              <div className="relative w-16 h-16 rounded-card overflow-hidden bg-cream shrink-0">
                {main.imageUrl && <Image src={main.imageUrl} alt="" fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-lg">{main.nameKaz}</span>
                  {main.totalCount === 0 && (
                    <span className="label-tag bg-gold/10 text-gold px-1.5 py-0.5 rounded">Жаңа</span>
                  )}
                </div>
                <div className="text-sm text-ink-muted">{main.nameRus}</div>
                <div className="text-xs text-ink-muted mt-1">
                  {main.productCount} өнім тікелей · {main.totalCount} жалпы (ішкі санаттармен)
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-xs items-end shrink-0">
                <div className="flex gap-2">
                  <button onClick={() => move(tree, main, -1)} disabled={i === 0} className="text-ink-muted disabled:opacity-30 cursor-pointer">↑</button>
                  <button onClick={() => move(tree, main, 1)} disabled={i === tree.length - 1} className="text-ink-muted disabled:opacity-30 cursor-pointer">↓</button>
                  <button onClick={() => setModal({ mode: "edit", category: main })} className="text-gold cursor-pointer">Өзгерту</button>
                  <button onClick={() => remove(main.id)} className="text-danger cursor-pointer">Жою</button>
                </div>
                <button
                  onClick={() => setModal({ mode: "create-sub", parentId: main.id, parentName: main.nameKaz })}
                  className="text-ink-muted hover:text-gold cursor-pointer"
                >
                  + Ішкі санат
                </button>
              </div>
            </div>

            {main.children.length > 0 && (
              <div className="mt-4 pl-4 border-l-2 border-line flex flex-col gap-2">
                {main.children.map((sub, j) => (
                  <div key={sub.id} className="flex items-center justify-between gap-3 py-1.5">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-ink-text">{sub.nameKaz}</div>
                      <div className="text-xs text-ink-muted">{sub.nameRus} · {sub.productCount} өнім</div>
                    </div>
                    <div className="flex gap-2 text-xs shrink-0">
                      <button onClick={() => move(main.children, sub, -1)} disabled={j === 0} className="text-ink-muted disabled:opacity-30 cursor-pointer">↑</button>
                      <button onClick={() => move(main.children, sub, 1)} disabled={j === main.children.length - 1} className="text-ink-muted disabled:opacity-30 cursor-pointer">↓</button>
                      <button onClick={() => setModal({ mode: "edit", category: sub })} className="text-gold cursor-pointer">Өзгерту</button>
                      <button onClick={() => remove(sub.id)} className="text-danger cursor-pointer">Жою</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {modal && (
        <CategoryFormModal
          state={modal}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function CategoryFormModal({
  state,
  onClose,
  onSaved,
}: {
  state: Exclude<ModalState, null>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = state.mode === "edit";
  const initial = isEdit ? state.category : null;
  const [nameKaz, setNameKaz] = useState(initial?.nameKaz ?? "");
  const [nameRus, setNameRus] = useState(initial?.nameRus ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.imageUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const title = isEdit
    ? "Категорияны өзгерту"
    : state.mode === "create-sub"
      ? `"${state.parentName}" ішіне жаңа ішкі санат`
      : "Жаңа негізгі категория";

  async function submit() {
    setSaving(true);
    setError(null);
    const url = isEdit ? `/api/categories/${state.category.id}` : "/api/categories";
    const method = isEdit ? "PATCH" : "POST";
    const body: Record<string, unknown> = { nameKaz, nameRus, imageUrl };
    if (state.mode === "create-sub") body.parentId = state.parentId;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
        <h2 className="font-display text-lg font-bold mb-4">{title}</h2>
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
