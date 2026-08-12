import type { Discipline } from "@/types/discipline";
import { useMemo } from "react";
import { FiClock, FiUser } from "react-icons/fi";

interface WeeklyCalendarProps {
  selectedDisciplines: Discipline[];
  enrolledDisciplines: Discipline[];
}

const LETTER_SLOTS = [
  { code: "A", start: "07:10", end: "08:00" },
  { code: "B", start: "08:00", end: "08:50" },
  { code: "C", start: "08:50", end: "09:40" },
  { code: "D", start: "09:50", end: "10:40" },
  { code: "E", start: "10:40", end: "11:30" },
  { code: "F", start: "11:30", end: "12:10" },
  { code: "G", start: "12:20", end: "13:10" },
  { code: "H", start: "13:10", end: "14:00" },
  { code: "I", start: "14:00", end: "14:50" },
  { code: "J", start: "14:50", end: "15:40" },
  { code: "K", start: "15:50", end: "16:40" },
  { code: "L", start: "16:40", end: "17:30" },
  { code: "M", start: "17:30", end: "18:20" },
  { code: "N", start: "18:30", end: "19:20" },
  { code: "O", start: "19:20", end: "20:10" },
  { code: "P", start: "20:20", end: "21:10" },
  { code: "Q", start: "21:10", end: "22:00" },
  { code: "R", start: "22:00", end: "22:50" },
  { code: "S", start: "22:50", end: "23:40" },
];

const COLOR_PALETTES = [
  {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800",
    accent: "border-l-blue-600 dark:border-l-blue-500",
    text: "text-blue-950 dark:text-blue-100",
    badgeBg: "bg-blue-100 dark:bg-blue-900/60",
    badgeText: "text-blue-700 dark:text-blue-300",
    timeText: "text-blue-600 dark:text-blue-400",
  },
  {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-800",
    accent: "border-l-orange-600 dark:border-l-orange-500",
    text: "text-orange-950 dark:text-orange-100",
    badgeBg: "bg-orange-100 dark:bg-orange-900/60",
    badgeText: "text-orange-700 dark:text-orange-300",
    timeText: "text-orange-600 dark:text-orange-400",
  },
  {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
    accent: "border-l-emerald-600 dark:border-l-emerald-500",
    text: "text-emerald-950 dark:text-emerald-100",
    badgeBg: "bg-emerald-100 dark:bg-emerald-900/60",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    timeText: "text-emerald-600 dark:text-emerald-400",
  },
  {
    bg: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-200 dark:border-purple-800",
    accent: "border-l-purple-600 dark:border-l-purple-500",
    text: "text-purple-950 dark:text-purple-100",
    badgeBg: "bg-purple-100 dark:bg-purple-900/60",
    badgeText: "text-purple-700 dark:text-purple-300",
    timeText: "text-purple-600 dark:text-purple-400",
  },
  {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-200 dark:border-rose-800",
    accent: "border-l-rose-600 dark:border-l-rose-500",
    text: "text-rose-950 dark:text-rose-100",
    badgeBg: "bg-rose-100 dark:bg-rose-900/60",
    badgeText: "text-rose-700 dark:text-rose-300",
    timeText: "text-rose-600 dark:text-rose-400",
  },
  {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    border: "border-cyan-200 dark:border-cyan-800",
    accent: "border-l-cyan-600 dark:border-l-cyan-500",
    text: "text-cyan-950 dark:text-cyan-100",
    badgeBg: "bg-cyan-100 dark:bg-cyan-900/60",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    timeText: "text-cyan-600 dark:text-cyan-400",
  },
  {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
    accent: "border-l-amber-600 dark:border-l-amber-500",
    text: "text-amber-950 dark:text-amber-100",
    badgeBg: "bg-amber-100 dark:bg-amber-900/60",
    badgeText: "text-amber-700 dark:text-amber-300",
    timeText: "text-amber-600 dark:text-amber-400",
  },
];

const SLOT_HEIGHT = 38;

const timeToMinutes = (t: string): number => {
  if (!t) return 0;
  const parts = t.slice(0, 5).split(":");
  return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
};

const getScheduleLetters = (startTime: string, endTime: string): string => {
  const sStart = timeToMinutes(startTime);
  const sEnd = timeToMinutes(endTime);

  const matched = LETTER_SLOTS.filter((slot) => {
    const slotStart = timeToMinutes(slot.start);
    const slotEnd = timeToMinutes(slot.end);
    return sStart < slotEnd && sEnd > slotStart;
  });

  return matched.map((m) => m.code).join("");
};

export default function WeeklyCalendar({
  selectedDisciplines,
  enrolledDisciplines,
}: WeeklyCalendarProps) {
  const allDisciplines = useMemo(
    () => [...enrolledDisciplines, ...selectedDisciplines],
    [enrolledDisciplines, selectedDisciplines]
  );

  const days = useMemo(() => {
    const baseDays = [
      { id: 0, label: "Segunda" },
      { id: 1, label: "Terça" },
      { id: 2, label: "Quarta" },
      { id: 3, label: "Quinta" },
      { id: 4, label: "Sexta" },
    ];

    const hasSaturday = allDisciplines.some((d) =>
      d.schedules?.some((s) => s.dayOfWeek === 5)
    );

    if (hasSaturday) {
      baseDays.push({ id: 5, label: "Sábado" });
    }

    return baseDays;
  }, [allDisciplines]);

  // Palette map per discipline ID
  const paletteMap = useMemo(() => {
    const map = new Map<string, (typeof COLOR_PALETTES)[0]>();
    allDisciplines.forEach((d, idx) => {
      map.set(d.id, COLOR_PALETTES[idx % COLOR_PALETTES.length]);
    });
    return map;
  }, [allDisciplines]);

  // Compute active slots
  const activeSlots = useMemo(() => {
    let minSlotIdx = 0; // Always start at Slot A (07:10)
    let maxSlotIdx = 16; // Default Q (22:00)

    allDisciplines.forEach((d) => {
      (d.schedules || []).forEach((s) => {
        const sStart = timeToMinutes(s.startTime);
        const sEnd = timeToMinutes(s.endTime);

        LETTER_SLOTS.forEach((slot, idx) => {
          const slotStart = timeToMinutes(slot.start);
          const slotEnd = timeToMinutes(slot.end);
          if (sStart < slotEnd && sEnd > slotStart) {
            if (idx < minSlotIdx) minSlotIdx = idx;
            if (idx > maxSlotIdx) maxSlotIdx = idx;
          }
        });
      });
    });

    return LETTER_SLOTS.slice(minSlotIdx, maxSlotIdx + 1);
  }, [allDisciplines]);

  const renderEvents = (dayId: number) => {
    const eventsToRender = [
      ...enrolledDisciplines.map((d) => ({ ...d, type: "enrolled" as const })),
      ...selectedDisciplines.map((d) => ({ ...d, type: "selected" as const })),
    ];

    return eventsToRender.flatMap((d) =>
      (d.schedules || [])
        .filter((s) => s.dayOfWeek === dayId)
        .map((s, idx) => {
          const sStart = timeToMinutes(s.startTime);
          const sEnd = timeToMinutes(s.endTime);

          let startSlotIdx = activeSlots.findIndex(
            (slot) => timeToMinutes(slot.end) > sStart
          );
          if (startSlotIdx === -1) startSlotIdx = 0;

          let endSlotIdx = activeSlots.findIndex(
            (slot) => timeToMinutes(slot.start) >= sEnd
          );
          if (endSlotIdx === -1) endSlotIdx = activeSlots.length;

          const spanCount = Math.max(1, endSlotIdx - startSlotIdx);
          const topPx = startSlotIdx * SLOT_HEIGHT;
          const heightPx = spanCount * SLOT_HEIGHT;

          const pal = paletteMap.get(d.id) || COLOR_PALETTES[0];
          const letterCode = getScheduleLetters(s.startTime, s.endTime);

          return (
            <div
              key={`${d.id}-${s.dayOfWeek}-${idx}`}
              className={`absolute left-1 right-1 p-1.5 sm:p-2 rounded-lg transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs z-10 border border-l-4 ${
                pal.bg
              } ${pal.border} ${pal.accent} ${
                d.type === "selected" ? "border-dashed opacity-90" : ""
              }`}
              style={{ top: `${topPx + 1}px`, height: `${heightPx - 2}px` }}
            >
              <div className="overflow-hidden space-y-0.5">
                {/* CODE BADGE & NAME */}
                <div
                  className={`font-bold text-[10px] sm:text-[11px] leading-tight break-words ${pal.text}`}
                >
                  <span
                    className={`font-mono font-extrabold px-1 py-0.5 rounded text-[8px] tracking-tight mr-1 inline-block align-middle ${pal.badgeBg} ${pal.badgeText}`}
                  >
                    {d.code || "CC-00"}
                  </span>
                  <span className="align-middle">{d.name}</span>
                  {d.type === "selected" && (
                    <span className="ml-1 text-[8px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-1 rounded inline-block align-middle">
                      Prévia
                    </span>
                  )}
                </div>

                {/* TEACHER */}
                {d.teacher?.name && (
                  <div
                    className={`flex items-center gap-1 text-[9px] font-medium opacity-90 truncate ${pal.text}`}
                  >
                    <FiUser className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{d.teacher.name}</span>
                  </div>
                )}
              </div>

              {/* TIME & LETTER BADGE */}
              <div
                className={`flex items-center gap-1 text-[9px] font-bold border-t border-slate-200/60 dark:border-slate-700/60 pt-0.5 mt-0.5 whitespace-nowrap ${pal.timeText}`}
              >
                <FiClock className="w-2.5 h-2.5 shrink-0" />
                <span>
                  <strong className="font-mono">{letterCode}</strong> (
                  {s.startTime.slice(0, 5)} - {s.endTime.slice(0, 5)})
                </span>
              </div>
            </div>
          );
        })
    );
  };

  const gridColsClass =
    days.length === 6
      ? "grid-cols-[130px_repeat(6,1fr)] sm:grid-cols-[140px_repeat(6,1fr)]"
      : "grid-cols-[130px_repeat(5,1fr)] sm:grid-cols-[140px_repeat(5,1fr)]";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full">
      {/* DICA DE ARRASTAR NO MOBILE */}
      <div className="sm:hidden text-[10px] text-slate-500 dark:text-slate-400 text-center py-1 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-semibold tracking-wide uppercase">
        ↔ Arraste para o lado para ver toda a semana
      </div>

      <div className="overflow-auto flex-1 relative">
        <div className="min-w-[800px] sm:min-w-[750px] h-full flex flex-col">
          {/* Header */}
          <div
            className={`grid ${gridColsClass} bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40`}
          >
            <div className="p-2.5 sm:p-3 text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 text-center border-r border-slate-200 dark:border-slate-700 uppercase sticky left-0 bg-slate-100 dark:bg-slate-800 z-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              Horário
            </div>
            {days.map((day) => (
              <div
                key={day.id}
                className="p-3 text-xs font-bold text-slate-700 dark:text-slate-200 text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 uppercase tracking-wider"
              >
                {day.label}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 relative bg-white dark:bg-slate-900">
            <div className={`grid ${gridColsClass} relative min-h-full`}>
              {/* Time axis (Letter + Time range) */}
              <div className="sticky left-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                {activeSlots.map((slot) => (
                  <div
                    key={slot.code}
                    className="flex items-center justify-center p-1 border-b border-slate-100 dark:border-slate-800/80"
                    style={{ height: SLOT_HEIGHT }}
                  >
                    <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-md px-2 py-0.5 w-full text-center flex items-center justify-center gap-1.5 shadow-2xs">
                      <strong className="font-mono font-extrabold text-emerald-700 dark:text-emerald-300 text-xs">
                        {slot.code}
                      </strong>
                      <span className="font-mono text-[9.5px] font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {slot.start} às {slot.end}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid columns */}
              {days.map((day) => (
                <div
                  key={day.id}
                  className="relative border-r border-slate-100 dark:border-slate-800/60 last:border-r-0"
                  style={{ height: activeSlots.length * SLOT_HEIGHT }}
                >
                  {/* Grid lines */}
                  {activeSlots.map((slot) => (
                    <div
                      key={slot.code}
                      className="border-b border-slate-100 dark:border-slate-800/60 last:border-b-0"
                      style={{ height: SLOT_HEIGHT }}
                    />
                  ))}

                  {/* Events overlay */}
                  {renderEvents(day.id)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
