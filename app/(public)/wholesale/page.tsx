import type { Metadata } from "next";
import { WholesaleContent } from "./WholesaleContent";

export const metadata: Metadata = {
  title: "Оптом сату шарттары | SAMGA",
  description: "Оптом деңгейлер, жеңілдіктер және жеткізу шарттары — SAMGA сумка каталогы.",
};

export default function WholesalePage() {
  return <WholesaleContent />;
}
