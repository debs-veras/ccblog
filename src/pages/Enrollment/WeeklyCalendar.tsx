import type { Discipline } from "@/types/discipline";
import { useMemo } from "react";
import { FiClock, FiUser } from "react-icons/fi";

interface WeeklyCalendarProps {
  selectedDisciplines: Discipline[];
  enrolledDisciplines: Discipline[];
}

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const START_HOUR = 8;
const END_HOUR = 22;
const SLOT_HEIGHT = 30;

export default function WeeklyCalendar({
  selectedDisciplines,
  enrolledDisciplines,
}: WeeklyCalendarProps) {
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = START_HOUR; h <= END_HOUR; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
    return slots;
  }, []);

  const calculatePosition = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const totalMinutes = (h - START_HOUR) * 60 + m;
    return (totalMinutes / 30) * SLOT_HEIGHT;
  };

  const calculateHeight = (start: string, end: string) => {
    const [h1, m1] = start.split(":").map(Number);
    const [h2, m2] = end.split(":").map(Number);
    const durationMinutes = (h2 - h1) * 60 + (m2 - m1);
    return (durationMinutes / 30) * SLOT_HEIGHT;
  };

  const renderEvents = (dayIndex: number) => {
    const day = dayIndex;
    const allEvents = [
      ...enrolledDisciplines.map((d) => ({ ...d, type: "enrolled" as const })),
      ...selectedDisciplines.map((d) => ({ ...d, type: "selected" as const })),
    ];

    return allEvents.flatMap((d) =>
      (d.schedules || [])
        .filter((s) => s.dayOfWeek === day)
        .map((s, idx) => {
          const top = calculatePosition(s.startTime);
          const height = calculateHeight(s.startTime, s.endTime);
          const blockHeight = Math.max(height - 4, 28);

          return (
            <div
              key={`${d.id}-${idx}`}
              className={`absolute left-1.5 right-1.5 p-2 sm:p-2.5 rounded-xl transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-md ${
                d.type === "enrolled"
                  ? "bg-blue-600 text-white border border-blue-500 z-20"
                  : "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border border-dashed border-blue-300 dark:border-blue-700 z-10"
              }`}
              style={{ top: `${top + 2}px`, height: `${blockHeight}px` }}
            >
              <div className="space-y-1 overflow-hidden">
                {/* NOME DA DISCIPLINA */}
                <div className="font-bold text-xs sm:text-sm leading-tight text-left line-clamp-2">
                  {d.name}
                </div>

                {/* HORÁRIO DAS AULAS (COMPLETO E SEM QUEBRA DE LINHA) */}
                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-mono font-medium opacity-95 whitespace-nowrap">
                  <FiClock className="w-3 h-3 shrink-0" />
                  <span>
                    {s.startTime.slice(0, 5)} - {s.endTime.slice(0, 5)}
                  </span>
                </div>
              </div>

              {/* NOME DO PROFESSOR */}
              {d.teacher?.name && (
                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium opacity-90 truncate pt-1 border-t border-white/20 mt-1 shrink-0">
                  <FiUser className="w-3 h-3 shrink-0" />
                  <span className="truncate">{d.teacher.name}</span>
                </div>
              )}
            </div>
          );
        }),
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full">
      {/* DICA DE ARRASTAR NO MOBILE */}
      <div className="sm:hidden text-[10px] text-slate-500 dark:text-slate-400 text-center py-1 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-semibold tracking-wide uppercase">
        ↔ Arraste para o lado para ver toda a semana
      </div>

      <div className="overflow-auto flex-1 relative">
        <div className="min-w-[700px] sm:min-w-[650px] h-full flex flex-col">
          {/* Header */}
          <div className="grid grid-cols-[65px_1fr_1fr_1fr_1fr_1fr] sm:grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
            <div className="p-2.5 sm:p-3 text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 text-center border-r border-slate-200 dark:border-slate-700 uppercase sticky left-0 bg-slate-100 dark:bg-slate-800 z-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              Horário
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="p-3 text-xs font-bold text-slate-700 dark:text-slate-200 text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 relative bg-white dark:bg-slate-900">
            <div className="grid grid-cols-[65px_1fr_1fr_1fr_1fr_1fr] sm:grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] relative min-h-full">
              {/* Time axis */}
              <div className="sticky left-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                {timeSlots.map((time, idx) => (
                  <div
                    key={time}
                    className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium flex items-center justify-center border-b border-slate-100 dark:border-slate-800/60"
                    style={{ height: SLOT_HEIGHT }}
                  >
                    {idx % 2 === 0 ? time : ""}
                  </div>
                ))}
              </div>

              {/* Grid columns */}
              {DAYS.map((_, i) => (
                <div
                  key={i}
                  className="relative border-r border-slate-100 dark:border-slate-800/60 last:border-r-0"
                >
                  {/* Grid lines */}
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="border-b border-slate-100 dark:border-slate-800/60 last:border-b-0"
                      style={{ height: SLOT_HEIGHT }}
                    />
                  ))}
                  {/* Events overlay */}
                  {renderEvents(i)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
