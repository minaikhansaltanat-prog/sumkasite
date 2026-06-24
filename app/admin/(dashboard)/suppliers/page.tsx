import { getSuppliers } from "@/lib/queries";
import { SupplierManager } from "@/components/admin/SupplierManager";

export const metadata = { title: "Жеткізушілер | SAMGA Admin" };

export default async function AdminSuppliersPage() {
  const suppliers = await getSuppliers();
  return <SupplierManager suppliers={suppliers} />;
}
