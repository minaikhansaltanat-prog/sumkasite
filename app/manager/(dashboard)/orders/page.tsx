import { getSessionFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { OrdersTable } from "@/components/admin/OrdersTable";

export const metadata = { title: "Тапсырыстарым | SAMGA Manager" };

export default async function ManagerOrdersPage() {
  const user = await getSessionFromCookies();
  const orders = await prisma.order.findMany({
    where: { OR: [{ managerId: user?.id }, { managerId: null }] },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Тапсырыстарым</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
