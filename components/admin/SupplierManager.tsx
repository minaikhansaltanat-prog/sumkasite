"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface SupplierRow {
  id: string;
  name: string;
  contact: string;
  note: string;
  productCount: number;
}

export function SupplierManager({ suppliers }: { suppliers: SupplierRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<SupplierRow | null>(null);
  const [creating, setCreating] = useState(false);

  async function remove(id: string) {
    if (!confirm("Жеткізушіні жою керек пе?")) return;
    const res = await fetch(`/api/suppliers/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Қате орын алды");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Жеткізушілер / Зауыттар</h1>
          <p className="text-sm text-ink-muted mt-1">
            Тек ішкі классификация — клиентке көрсетілмейді. Әр тауарға жеткізушіні «Сумкалар» бөлімінде тағайындай аласыз.
          </p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary">+ Жаңа жеткізуші</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div key={s.id} className="card p-4">
            <div className="font-semibold text-ink-text">{s.name}</div>
            {s.contact && <div className="text-sm text-ink-muted mt-0.5">{s.contact}</div>}
            {s.note && <div className="text-xs text-ink-muted mt-1.5 line-clamp-3">{s.note}</div>}
            <div className="text-xs text-gold font-medium mt-2">{s.productCount} өнім</div>
            <div className="flex gap-3 mt-3 text-xs">
              <button onClick={() => setEditing(s)} className="text-gold cursor-pointer">Өзгерту</button>
              <button onClick={() => remove(s.id)} className="text-danger cursor-pointer">Жою</button>
            </div>
          </div>
        ))}
        {suppliers.length === 0 && (
          <div className="col-span-full py-10 text-center text-ink-muted">Әзірге жеткізуші қосылмаған</div>
        )}
      </div>

      {(creating || editing) && (
        <SupplierFormModal
          supplier={editing}
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

function SupplierFormModal({
  supplier,
  onClose,
  onSaved,
}: {
  supplier: SupplierRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(supplier?.name ?? "");
  const [contact, setContact] = useState(supplier?.contact ?? "");
  const [note, setNote] = useState(supplier?.note ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    setError(null);
    const url = supplier ? `/api/suppliers/${supplier.id}` : "/api/suppliers";
    const method = supplier ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, contact, note }),
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
        <h2 className="font-display text-lg font-bold mb-4">{supplier ? "Жеткізушіні өзгерту" : "Жаңа жеткізуші"}</h2>
        <div className="flex flex-col gap-3">
          <input
            placeholder="Атауы (мыс. Гуанчжоу фабрикасы №3)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 px-3 rounded-card border border-line focus:border-gold outline-none"
          />
          <input
            placeholder="Байланыс (WeChat, телефон...)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="h-11 px-3 rounded-card border border-line focus:border-gold outline-none"
          />
          <textarea
            placeholder="Ескерту (мыс. сапасы, мекенжайы...)"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="px-3 py-2 rounded-card border border-line focus:border-gold outline-none"
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
