import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email дұрыс емес"),
  password: z.string().min(1, "Пароль міндетті"),
});

export const productImageSchema = z.object({
  url: z.string().min(1),
  thumbUrl: z.string().optional(),
  order: z.number().int().default(0),
  isMain: z.boolean().default(false),
});

export const productSchema = z.object({
  nameKaz: z.string().min(2, "Атауы (қаз) міндетті"),
  nameRus: z.string().min(2, "Атауы (рус) міндетті"),
  slug: z.string().optional(),
  sku: z.string().min(2, "Артикул міндетті"),
  descKaz: z.string().optional().default(""),
  descRus: z.string().optional().default(""),
  price: z.coerce.number().int().positive("Баға дұрыс емес"),
  costPrice: z.coerce.number().int().min(0).optional().nullable(),
  retailPrice: z.coerce.number().int().positive().optional().nullable(),
  minOrder: z.coerce.number().int().min(1).default(10),
  bundleSize: z.coerce.number().int().min(1).default(1),
  stock: z.coerce.number().int().min(0).default(0),
  material: z.string().optional().default(""),
  color: z.string().optional().default(""),
  size: z.string().optional().default(""),
  categoryId: z.string().min(1, "Категория міндетті"),
  isPublished: z.boolean().default(true),
  isNew: z.boolean().default(false),
  isHit: z.boolean().default(false),
  images: z.array(productImageSchema).default([]),
});

export const categorySchema = z.object({
  nameKaz: z.string().min(2, "Атауы (қаз) міндетті"),
  nameRus: z.string().min(2, "Атауы (рус) міндетті"),
  slug: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  parentId: z.string().optional().nullable(),
});

export const orderCreateSchema = z.object({
  clientName: z.string().min(2, "Аты-жөні міндетті"),
  phone: z.string().min(1, "Телефон міндетті"),
  city: z.string().optional().default(""),
  productId: z.string().optional().nullable(),
  productName: z.string().min(1),
  sku: z.string().optional().default(""),
  quantity: z.coerce.number().int().min(1).default(10),
  message: z.string().optional().default(""),
});

export const orderUpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"]),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Аты-жөні міндетті"),
  phone: z.string().min(5, "Телефон міндетті"),
  message: z.string().min(2, "Хабар міндетті"),
});
