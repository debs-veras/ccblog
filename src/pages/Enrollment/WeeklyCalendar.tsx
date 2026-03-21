import { useMemo } from "react";
import type { Discipline } from "../../types/discipline";

interface WeeklyCalendarProps {
  selectedDisciplines: Discipline[];
  enrolledDisciplines: Discipline[];
}

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const START_HOUR = 8;
const END_HOUR = 22;
const SLOT_HEIGHT = 24; 

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
    console.log(enrolledDisciplines)
    const day = dayIndex + 1; 
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

          return (
            <div
              key={`${d.id}-${idx}`}
              className={`absolute left-1 right-1 p-1 rounded border text-[9px] leading-tight overflow-hidden transition-all duration-300 ${
                d.type === "enrolled"
                  ? "bg-blue-600 border-blue-700 text-white shadow-md z-20"
                  : "bg-blue-100 border-blue-300 text-blue-800 z-10 opacity-90 border-dashed"
              }`}
              style={{ top: `${top}px`, height: `${height}px` }}
            >
              <div className="font-bold truncate">{d.name}</div>
              <div className="opacity-80">
                {s.startTime} - {s.endTime}
              </div>
              <div className="truncate">{d.teacher?.name}</div>
            </div>
          );
        })
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="overflow-auto flex-1 relative">
        <div className="min-w-[650px] h-full flex flex-col">
          {/* Header */}
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] bg-gray-50 border-b border-gray-200 sticky top-0 z-40">
            <div className="p-3 text-xs font-bold text-gray-400 text-center border-r-2 border-gray-200 uppercase sticky left-0 bg-gray-50 z-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
              Horário
            </div>
            {DAYS.map((day) => (
              <div key={day} className="p-3 text-xs font-bold text-gray-700 text-center border-r border-gray-200 last:border-r-0 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 relative bg-slate-50">
            <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] relative min-h-full">
              {/* Time axis */}
              <div className="sticky left-0 border-r-2 border-gray-200 bg-white z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                {timeSlots.map((time, idx) => (
                  <div
                    key={time}
                    className="text-[10px] text-gray-400 font-medium flex items-start justify-center pt-1 border-b border-gray-50"
                    style={{ height: SLOT_HEIGHT }}
                  >
                    {idx % 2 === 0 ? time : ""}
                  </div>
                ))}
              </div>

              {/* Grid columns */}
              {DAYS.map((_, i) => (
                <div key={i} className="relative border-r border-gray-100 last:border-r-0">
                  {/* Grid lines */}
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="border-b border-gray-100 last:border-b-0"
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
