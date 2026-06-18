"use client";

import { useRouter } from "next/navigation";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

interface OrderRow {
  id: string;
  clientName: string;
  phone: string;
  city: string;
  productName: string;
  sku: string;
  quantity: number;
  message: string;
  status: string;
  createdAt: string | Date;
  managerId: string | null;
  manager?: { name: string } | null;
}

interface ManagerOption {
  id: string;
  name: string;
}

export function OrdersTable({
  orders,
  managers,
  canAssign,
}: {
  orders: OrderRow[];
  managers?: ManagerOption[];
  canAssign?: boolean;
}) {
  const router = useRouter();

  async function updateStatus(id: string, status: OrderStatus) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function assign(id: string, managerId: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ managerId: managerId || null }),
    });
    router.refresh();
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-ink-muted border-b border-line">
            <th className="py-3 px-3">Клиент</th>
            <th className="py-3 px-3">Сумка / Артикул</th>
            <th className="py-3 px-3">Сан</th>
            <th className="py-3 px-3">Мәртебе</th>
            {canAssign && <th className="py-3 px-3">Менеджер</th>}
            <th className="py-3 px-3">Уақыт</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-line/60 align-top">
              <td className="py-2 px-3">
                <div className="font-medium">{o.clientName}</div>
                <div className="text-xs text-ink-muted">{o.phone} {o.city && `· ${o.city}`}</div>
                {o.message && <div className="text-xs text-ink-muted mt-1 max-w-xs">{o.message}</div>}
              </td>
              <td className="py-2 px-3">
                <div>{o.productName}</div>
                <div className="text-xs price-mono text-ink-muted">{o.sku}</div>
              </td>
              <td className="py-2 px-3">{o.quantity}</td>
              <td className="py-2 px-3">
                <select
                  defaultValue={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                  className="h-9 px-2 rounded-card border border-line text-xs outline-none focus:border-gold"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.labelKaz}</option>
                  ))}
                </select>
              </td>
              {canAssign && (
                <td className="py-2 px-3">
                  <select
                    defaultValue={o.managerId ?? ""}
                    onChange={(e) => assign(o.id, e.target.value)}
                    className="h-9 px-2 rounded-card border border-line text-xs outline-none focus:border-gold"
                  >
                    <option value="">Тағайындалмаған</option>
                    {managers?.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </td>
              )}
              <td className="py-2 px-3 text-ink-muted whitespace-nowrap">
                {new Date(o.createdAt).toLocaleDateString("ru-RU")}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr><td colSpan={canAssign ? 6 : 5} className="py-8 text-center text-ink-muted">Тапсырыс жоқ</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
