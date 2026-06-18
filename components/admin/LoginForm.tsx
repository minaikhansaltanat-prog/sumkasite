"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Қате орын алды");
      return;
    }
    const from = searchParams.get("from");
    if (from) {
      router.push(from);
    } else if (data.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/manager");
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-4">
      <div>
        <label className="label-tag text-white/60">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 mt-1.5 px-4 rounded-card bg-white/5 border border-white/15 text-white focus:border-gold outline-none"
        />
      </div>
      <div>
        <label className="label-tag text-white/60">Пароль</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 mt-1.5 px-4 rounded-card bg-white/5 border border-white/15 text-white focus:border-gold outline-none"
        />
      </div>
      {error && <p className="text-danger text-sm">{error}</p>}
      <button disabled={loading} className="btn-primary mt-2">
        {loading ? "Жүктелуде..." : "Кіру"}
      </button>
    </form>
  );
}
