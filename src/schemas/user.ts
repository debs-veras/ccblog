import { z } from "zod";
export const RoleEnum = z.enum(["STUDENT", "ADMIN", "TEACHER"]);

export const userSchema = z
  .object({
    name: z.string().min(2, "Nome muito curto").max(100, "Nome muito longo"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(6, "Senha deve ter no mínimo 6 caracteres")
      .optional(),
    confirmPassword: z.string().min(6, "Confirme sua nova senha").optional(),
    role: RoleEnum,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
