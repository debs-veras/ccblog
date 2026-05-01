import z from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  slug: z.string().min(2, "Slug obrigatório"),
  description: z.string().optional(),
});
