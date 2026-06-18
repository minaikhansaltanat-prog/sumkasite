import { prisma } from "@/lib/db";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const metadata = { title: "Тапсырыстар | SAMGA Admin" };

export default async function AdminOrdersPage() {
  const [orders, managers] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { manager: true } }),
    prisma.user.findMany({ where: { role: "MANAGER" }, select: { id: true, name: true } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Тапсырыстар</h1>
      <OrdersTable orders={orders} managers={managers} canAssign />
    </div>
  );
}
