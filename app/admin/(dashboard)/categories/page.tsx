import { getCategoryTree } from "@/lib/queries";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const metadata = { title: "Категориялар | SAMGA Admin" };

export default async function AdminCategoriesPage() {
  const tree = await getCategoryTree();
  return <CategoryManager tree={tree} />;
}
