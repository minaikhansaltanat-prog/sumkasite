"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";

const ITEMS = [
  { href: "/manager", label: "Дашборд" },
  { href: "/manager/orders", label: "Тапсырыстарым" },
];

export function ManagerSidebar({ name }: { name: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-60 shrink-0 bg-ink min-h-screen flex flex-col">
      <div className="p-6">
        <div className="font-display text-xl font-bold text-white">SAMGA</div>
        <div className="text-xs text-white/40 mt-1">{name} · Менеджер</div>
      </div>
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "px-3 py-2.5 rounded-card text-sm font-medium transition-colors",
              pathname === item.href ? "bg-gold text-ink" : "text-white/70 hover:bg-white/5"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 flex flex-col gap-1 border-t border-white/10">
        <Link href="/catalog" className="px-3 py-2.5 rounded-card text-sm text-white/60 hover:bg-white/5">
          Каталогты қарау
        </Link>
        <button onClick={logout} className="px-3 py-2.5 rounded-card text-sm text-left text-danger hover:bg-white/5">
          Шығу
        </button>
      </div>
    </aside>
  );
}
