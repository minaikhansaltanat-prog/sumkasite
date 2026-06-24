import type { Metadata } from "next";
import { CartContent } from "@/components/cart/CartContent";

export const metadata: Metadata = {
  title: "Себет | SAMGA",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartContent />;
}
