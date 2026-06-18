export type Role = "ADMIN" | "MANAGER";

export type OrderStatus =
  | "NEW"
  | "CONTACTED"
  | "PROCESSING"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export const ORDER_STATUSES: { value: OrderStatus; labelKaz: string; labelRus: string }[] = [
  { value: "NEW", labelKaz: "Жаңа", labelRus: "Новый" },
  { value: "CONTACTED", labelKaz: "Байланысылды", labelRus: "Связались" },
  { value: "PROCESSING", labelKaz: "Өңделуде", labelRus: "В обработке" },
  { value: "SHIPPED", labelKaz: "Жіберілді", labelRus: "Отправлен" },
  { value: "COMPLETED", labelKaz: "Аяқталды", labelRus: "Завершён" },
  { value: "CANCELLED", labelKaz: "Болдырылмады", labelRus: "Отменён" },
];

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}
