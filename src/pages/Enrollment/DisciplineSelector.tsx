import { useMemo } from "react";
import type { Discipline } from "../../types/discipline";
import type { Enrollment } from "../../types/enrollment";
import { FiCheck, FiPlus, FiAlertCircle, FiTrash2 } from "react-icons/fi";

interface DisciplineSelectorProps {
  disciplines: Discipline[];
  enrollments: Enrollment[];
  onToggle: (discipline: Discipline) => void;
  onComplete: (discipline: Discipline) => void;
  checkPrerequisites: (discipline: Discipline) => { ok: boolean; message?: string };
  checkScheduleClash: (discipline: Discipline) => { ok: boolean; message?: string };
}

export default function DisciplineSelector({
  disciplines,
  enrollments,
  onToggle,
  onComplete,
  checkPrerequisites,
  checkScheduleClash,
}: DisciplineSelectorProps) {
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
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">
            {p.titulo}
          </h3>
          <div className="grid gap-2">
            {p.disciplinas.map((d) => {
              const enrollment = enrollments.find((e) => e.disciplineId === d.id);
              const isEnrolled = enrollment?.status === "ENROLLED";
              const isPassed = enrollment?.status === "PASSED";

              const prereqStatus = checkPrerequisites(d);
              const clashStatus = !isEnrolled && !isPassed ? checkScheduleClash(d) : { ok: true };

              const hasWarning = !isEnrolled && !isPassed && (!prereqStatus.ok || !clashStatus.ok);
              const warningMessage = !prereqStatus.ok ? prereqStatus.message : clashStatus.message;

              return (
                <div
                  key={d.id}
                  className={`group relative p-3 rounded-lg border transition-all duration-200 flex items-center justify-between ${
                    isEnrolled
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : isPassed
                      ? "bg-green-50 border-green-200 opacity-80"
                      : hasWarning
                      ? "bg-red-50 border-red-200 cursor-not-allowed"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer"
                  }`}
                  onClick={() => !isEnrolled && !isPassed && !hasWarning && onToggle(d)}
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
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm truncate">
                      {d.name}
                    </h4>
                    {hasWarning ? (
                      <p className="text-[10px] text-red-500 font-medium mt-0.5 flex items-center gap-1">
                        <FiAlertCircle size={12} />
                        {warningMessage}
                      </p>
                    ) : (
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">
                          {d.workload}h
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-2">
                    {isEnrolled && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onComplete(d);
                          }}
                          title="Concluir Disciplina"
                          className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
                        >
                          <FiCheck size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggle(d); 
                          }}
                          title="Remover Matrícula"
                          className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    )}
                    
                    {isPassed && (
                      <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shadow-sm">
                        <FiCheck size={16} />
                      </div>
                    )}

                    {!isEnrolled && !isPassed && (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          hasWarning
                            ? "bg-gray-100 text-gray-300"
                            : "bg-gray-100 text-gray-400 group-hover:bg-blue-600 group-hover:text-white"
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
