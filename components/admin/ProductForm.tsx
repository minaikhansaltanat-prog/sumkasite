"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MultiImageUploader, type UploaderImage } from "./MultiImageUploader";

interface CategoryOption {
  id: string;
  nameKaz: string;
  children?: { id: string; nameKaz: string }[];
}

export interface ProductFormValues {
  id?: string;
  nameKaz: string;
  nameRus: string;
  sku: string;
  descKaz: string;
  descRus: string;
  price: number;
  costPrice: number | null;
  retailPrice: number | null;
  minOrder: number;
  bundleSize: number;
  stock: number;
  material: string;
  color: string;
  size: string;
  categoryId: string;
  isPublished: boolean;
  isNew: boolean;
  isHit: boolean;
  images: UploaderImage[];
}

const EMPTY: ProductFormValues = {
  nameKaz: "",
  nameRus: "",
  sku: "",
  descKaz: "",
  descRus: "",
  price: 0,
  costPrice: null,
  retailPrice: null,
  minOrder: 10,
  bundleSize: 1,
  stock: 0,
  material: "",
  color: "",
  size: "",
  categoryId: "",
  isPublished: true,
  isNew: false,
  isHit: false,
  images: [],
};

export function ProductForm({
  categories,
  initial,
}: {
  categories: CategoryOption[];
  initial?: ProductFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(
    initial ?? { ...EMPTY, categoryId: categories[0]?.id ?? "" }
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const url = initial?.id ? `/api/products/${initial.id}` : "/api/products";
    const method = initial?.id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Қате орын алды");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-8 max-w-3xl">
      {error && <p className="text-danger text-sm bg-danger/10 px-4 py-2 rounded-card">{error}</p>}

      <Section title="Негізгі ақпарат">
        <Field label="Атауы (қаз)">
          <input required value={values.nameKaz} onChange={(e) => set("nameKaz", e.target.value)} className="input" />
        </Field>
        <Field label="Атауы (рус)">
          <input required value={values.nameRus} onChange={(e) => set("nameRus", e.target.value)} className="input" />
        </Field>
        <Field label="Артикул (SKU)">
          <input required value={values.sku} onChange={(e) => set("sku", e.target.value)} className="input" />
        </Field>
        <Field label="Категория">
          <select required value={values.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="input">
            {categories.map((c) => (
              <optgroup key={c.id} label={c.nameKaz}>
                <option value={c.id}>{c.nameKaz} (жалпы)</option>
                {c.children?.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    &nbsp;&nbsp;↳ {sub.nameKaz}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="Материал">
          <input value={values.material} onChange={(e) => set("material", e.target.value)} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Түс">
            <input value={values.color} onChange={(e) => set("color", e.target.value)} className="input" />
          </Field>
          <Field label="Өлшем">
            <input value={values.size} onChange={(e) => set("size", e.target.value)} className="input" />
          </Field>
        </div>
        <Field label="Сипаттама (қаз)">
          <textarea rows={3} value={values.descKaz} onChange={(e) => set("descKaz", e.target.value)} className="input" />
        </Field>
        <Field label="Сипаттама (рус)">
          <textarea rows={3} value={values.descRus} onChange={(e) => set("descRus", e.target.value)} className="input" />
        </Field>
      </Section>

      <Section title="Өндіріс, бізге келетін баға">
        <p className="text-xs text-ink-muted -mt-1 mb-1">
          Бұл баға тек осы жерде, админ панелінде көрінеді. Сайттың қоғамдық беттерінде (каталог, өнім беті) ешқашан көрсетілмейді — тек маржаны есептеу үшін.
        </p>
        <Field label="Зауыттан келетін баға (тг)">
          <input
            type="number"
            min={0}
            value={values.costPrice ?? ""}
            onChange={(e) => set("costPrice", e.target.value ? Number(e.target.value) : null)}
            className="input"
          />
        </Field>
      </Section>

      <Section title="Баға мен мөлшер">
        <p className="text-xs text-ink-muted -mt-1 mb-1">Бұл бағалар сайтта клиентке көрінеді.</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Оптом сату бағасы (тг)">
            <input type="number" required value={values.price} onChange={(e) => set("price", Number(e.target.value))} className="input" />
          </Field>
          <Field label="Бөлшек бағасы (тг)">
            <input
              type="number"
              value={values.retailPrice ?? ""}
              onChange={(e) => set("retailPrice", e.target.value ? Number(e.target.value) : null)}
              className="input"
            />
          </Field>
          {values.costPrice !== null && values.price > 0 && (
            <div className="col-span-2 flex items-center gap-2 -mt-1">
              <span className="label-tag">Маржа:</span>
              <span className="text-sm font-semibold text-gold price-mono">
                {(values.price - values.costPrice).toLocaleString("ru-RU")} тг
                {" "}
                ({Math.round(((values.price - values.costPrice) / values.price) * 100)}%)
              </span>
            </div>
          )}
          <Field label="Кіші бума (дана)">
            <input type="number" value={values.bundleSize} onChange={(e) => set("bundleSize", Number(e.target.value))} className="input" />
          </Field>
          <Field label="Минималды тапсырыс">
            <input type="number" value={values.minOrder} onChange={(e) => set("minOrder", Number(e.target.value))} className="input" />
          </Field>
          <Field label="Стоктағы саны">
            <input type="number" value={values.stock} onChange={(e) => set("stock", Number(e.target.value))} className="input" />
          </Field>
        </div>
      </Section>

      <Section title="Суреттер">
        <MultiImageUploader images={values.images} onChange={(images) => set("images", images)} />
      </Section>

      <Section title="Статус">
        <div className="flex flex-col gap-2">
          <Checkbox label="Жарияланған (сайтта көрінеді)" checked={values.isPublished} onChange={(v) => set("isPublished", v)} />
          <Checkbox label="Жаңа тауар белгісі" checked={values.isNew} onChange={(v) => set("isNew", v)} />
          <Checkbox label="Хит белгісі (басты бетте шығады)" checked={values.isHit} onChange={(v) => set("isHit", v)} />
        </div>
      </Section>

      <div className="flex gap-3">
        <button disabled={saving} className="btn-primary">{saving ? "Сақталуда..." : "Сақтау"}</button>
        <button type="button" onClick={() => router.push("/admin/products")} className="btn-secondary">Бас тарту</button>
      </div>

      <style jsx global>{`
        .input {
          height: 2.75rem;
          padding: 0 0.75rem;
          border-radius: 12px;
          border: 1px solid #d8d0c0;
          width: 100%;
          outline: none;
        }
        textarea.input {
          height: auto;
          padding: 0.6rem 0.75rem;
        }
        .input:focus {
          border-color: #c9a84c;
        }
      `}</style>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h2 className="font-display text-lg font-bold mb-4">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="label-tag">{label}</span>
      {children}
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-[#C9A84C] w-4 h-4" />
      {label}
    </label>
  );
}
