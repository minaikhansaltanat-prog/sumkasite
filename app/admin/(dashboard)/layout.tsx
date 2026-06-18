import { getSessionFromCookies } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionFromCookies();

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar name={user?.name ?? ""} role={user?.role ?? ""} />
      <main className="flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
