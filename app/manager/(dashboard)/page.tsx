import { getSessionFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const metadata = { title: "Дашборд | SAMGA Manager" };

export default async function ManagerDashboardPage() {
  const user = await getSessionFromCookies();
  const orders = await prisma.order.findMany({
    where: { OR: [{ managerId: user?.id }, { managerId: null }] },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Дашборд</h1>
      <p className="text-ink-muted mb-6">Сізге тағайындалған және жаңа (тағайындалмаған) тапсырыстар.</p>
      <OrdersTable orders={orders} />
    </div>
  );
}
