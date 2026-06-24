"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";

const ITEMS = [
  { href: "/admin/dashboard", label: "Дашборд" },
  { href: "/admin/products", label: "Сумкалар" },
  { href: "/admin/categories", label: "Категориялар" },
  { href: "/admin/suppliers", label: "Жеткізушілер" },
  { href: "/admin/orders", label: "Тапсырыстар" },
];

export function Sidebar({ name, role }: { name: string; role: string }) {
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
        <div className="text-xs text-white/40 mt-1">{name} · {role}</div>
      </div>
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "px-3 py-2.5 rounded-card text-sm font-medium transition-colors",
              pathname.startsWith(item.href) ? "bg-gold text-white" : "text-white/70 hover:bg-white/5"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 flex flex-col gap-1 border-t border-white/10">
        <Link href="/" className="px-3 py-2.5 rounded-card text-sm text-white/60 hover:bg-white/5">
          ← Сайтқа қайту
        </Link>
        <button onClick={logout} className="px-3 py-2.5 rounded-card text-sm text-left text-danger hover:bg-white/5">
          Шығу
        </button>
      </div>
    </aside>
  );
}
