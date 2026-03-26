import { z } from "zod";

// ================== Horários ==================
export const scheduleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6, "Dia da semana inválido (0-6)"),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato de hora inválido, ex: 08:00"),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Formato de hora inválido, ex: 10:00"),
});

// ================== Criação ==================
export const disciplineSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  code: z.string().min(1, "Código é obrigatório"),
  description: z.string().optional(),
  materialUrl: z.union([z.string().url("URL inválida"), z.literal("")]).optional(),
  period: z.number().min(0, "Período inválido").max(9, "Período inválido"),
  workload: z.string().min(1, "Carga horária inválida"),
  teacherId: z.string().optional(),
  schedules: z.array(scheduleSchema),
  prerequisiteIds: z.array(z.string().uuid()).optional(),
});
