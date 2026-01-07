import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  category: z.string().min(1, "A categoria é obrigatória."),
  quantity: z
    .number()
    .int()
    .nonnegative("A quantidade deve ser um número inteiro positivo."),
  price: z.number().positive("O preço deve ser maior que zero."),
});

export const produtoUpdateSchema = productSchema.partial();
