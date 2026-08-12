import type { Discipline } from "@/types/discipline";
import type { Enrollment } from "@/types/enrollment";
import { useMemo } from "react";
import { FiCheck, FiPlus, FiAlertCircle, FiTrash2, FiUser, FiLoader } from "react-icons/fi";

interface DisciplineSelectorProps {
  disciplines: Discipline[];
  enrollments: Enrollment[];
  pendingDisciplineIds?: string[];
  onToggle: (discipline: Discipline) => void;
  onComplete: (discipline: Discipline) => void;
  checkPrerequisites: (discipline: Discipline) => {
    ok: boolean;
    message?: string;
  };
  checkScheduleClash: (discipline: Discipline) => {
    ok: boolean;
    message?: string;
  };
}

export default function DisciplineSelector({
  disciplines,
  enrollments,
  pendingDisciplineIds = [],
  onToggle,
  onComplete,
  checkPrerequisites,
  checkScheduleClash,
}: DisciplineSelectorProps) {
  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  const matriz = useMemo(() => {
    const periods = [];
    for (let i = 1; i <= 9; i++) {
      const perDisciplines = disciplines.filter((d) => d.period === i);
      if (perDisciplines.length > 0) {
        periods.push({
          titulo: `${i}º Semestre`,
          disciplinas: perDisciplines,
        });
      }
    }
    const optativas = disciplines.filter((d) => d.period === 0);
    if (optativas.length > 0) {
      periods.push({
        titulo: "Optativas",
        disciplinas: optativas,
      });
    }
    return periods;
  }, [disciplines]);

  return (
    <div className="space-y-6">
      {matriz.map((p) => (
        <div key={p.titulo} className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-1">
            {p.titulo}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {p.disciplinas.map((d) => {
              const enrollment = enrollments.find((e) => e.disciplineId === d.id);
              const isEnrolled = enrollment?.status === "ENROLLED";
              const isPassed = enrollment?.status === "PASSED";
              const isPending = pendingDisciplineIds.includes(d.id);

              const prereqStatus = checkPrerequisites(d);
              const clashStatus = !isEnrolled && !isPassed ? checkScheduleClash(d) : { ok: true };

              const hasWarning = !isEnrolled && !isPassed && (!prereqStatus.ok || !clashStatus.ok);
              const warningMessage = !prereqStatus.ok ? prereqStatus.message : clashStatus.message;

              return (
                <div
                  key={d.id}
                  className={`group relative p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isPending
                      ? "opacity-75 pointer-events-none bg-slate-50 dark:bg-slate-900 border-blue-300 dark:border-blue-700"
                      : isEnrolled
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 shadow-xs"
                        : isPassed
                          ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 opacity-80"
                          : hasWarning
                            ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 cursor-not-allowed"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md cursor-pointer"
                  }`}
                  onClick={() => !isPending && !isEnrolled && !isPassed && !hasWarning && onToggle(d)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {d.code}
                      </span>
                      {isEnrolled && (
                        <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          Cursando
                        </span>
                      )}
                      {isPassed && (
                        <span className="bg-green-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          Aprovado
                        </span>
                      )}
                      {isPending && (
                        <span className="bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1">
                          <FiLoader className="w-2.5 h-2.5 animate-spin" />
                          Processando
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate mt-1">
                      {d.name}
                    </h4>

                    {/* NOME DO PROFESSOR */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <FiUser className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">
                        {d.teacher?.name ? `Prof(a). ${d.teacher.name}` : "Docente a definir"}
                      </span>
                    </div>

                    {hasWarning ? (
                      <p className="text-[10px] text-red-500 font-medium mt-1.5 flex items-center gap-1">
                        <FiAlertCircle size={12} />
                        {warningMessage}
                      </p>
                    ) : (
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {d.schedules
                            ?.map(
                              (s) =>
                                `${weekDays[s.dayOfWeek]} ${s.startTime.slice(0, 5)}-${s.endTime.slice(0, 5)}`,
                            )
                            .join(" • ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {isPending ? (
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <FiLoader className="w-4 h-4 animate-spin" />
                      </div>
                    ) : isEnrolled ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onComplete(d);
                          }}
                          title="Concluir Disciplina"
                          className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
                        >
                          <FiCheck size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggle(d);
                          }}
                          title="Remover Matrícula"
                          className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ) : isPassed ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggle(d);
                        }}
                        title="Remover disciplina concluída"
                        className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          hasWarning
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-300 group-hover:bg-blue-600 group-hover:text-white"
                        }`}
                      >
                        <FiPlus size={16} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
