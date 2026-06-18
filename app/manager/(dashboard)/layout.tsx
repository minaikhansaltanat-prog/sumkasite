import { getSessionFromCookies } from "@/lib/auth";
import { ManagerSidebar } from "@/components/admin/ManagerSidebar";

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionFromCookies();
  return (
    <div className="flex min-h-screen bg-cream">
      <ManagerSidebar name={user?.name ?? ""} />
      <main className="flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}
