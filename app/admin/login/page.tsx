import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Кіру | SAMGA Admin" };

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4">
      <div className="font-display text-3xl font-bold text-white mb-1">SAMGA</div>
      <div className="text-gold label-tag mb-8">Admin / Manager панелі</div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
