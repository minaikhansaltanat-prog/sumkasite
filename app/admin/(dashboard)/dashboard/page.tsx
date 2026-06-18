import Link from "next/link";
import { prisma } from "@/lib/db";
import { ORDER_STATUSES } from "@/lib/types";

export const metadata = { title: "Дашборд | SAMGA Admin" };

export default async function AdminDashboardPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totalProducts, todayOrders, monthOrders, outOfStock, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const cards = [
    { label: "Барлық сумка", value: totalProducts },
    { label: "Бүгінгі тапсырыс", value: todayOrders },
    { label: "Осы айдағы тапсырыс", value: monthOrders },
    { label: "Жоқ тауарлар", value: outOfStock },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Дашборд</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <div className="text-3xl font-bold price-mono text-gold">{c.value}</div>
            <div className="text-sm text-ink-muted mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <Link href="/admin/products/new" className="btn-primary">+ Жаңа сумка қосу</Link>
        <Link href="/admin/orders" className="btn-secondary">Тапсырыстарды қарау</Link>
      </div>

      <div className="card mt-8 p-5 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-lg font-bold">Соңғы тапсырыстар</h2>
          <Link href="/admin/orders" className="text-sm text-gold hover:underline">Барлығын қарау</Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-muted border-b border-line">
              <th className="py-2">Клиент</th>
              <th className="py-2">Сумка</th>
              <th className="py-2">Сан</th>
              <th className="py-2">Мәртебе</th>
              <th className="py-2">Уақыт</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-b border-line/60">
                <td className="py-2">{o.clientName}</td>
                <td className="py-2">{o.productName}</td>
                <td className="py-2">{o.quantity}</td>
                <td className="py-2">{ORDER_STATUSES.find((s) => s.value === o.status)?.labelKaz ?? o.status}</td>
                <td className="py-2 text-ink-muted">{o.createdAt.toLocaleDateString("ru-RU")}</td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-ink-muted">Тапсырыс жоқ</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
