import { FiX, FiCheck } from "react-icons/fi";
import type { Enrollment } from "../../types/enrollment";
import type { Discipline } from "../../types/discipline";
import Box from "../../components/UI/Box";

interface Props {
  enrollments: Enrollment[];
  onToggle: (discipline: Discipline) => void;
  onComplete: (discipline: Discipline) => void;
}

export default function EnrolledDisciplines({
  enrollments,
  onToggle,
  onComplete,
}: Props) {
  const enrolled = enrollments
    .filter((e) => e.status === "ENROLLED")
    .sort((a, b) => {
      const aTime = a.discipline.schedules[0]?.startTime || "";
      const bTime = b.discipline.schedules[0]?.startTime || "";
      return aTime.localeCompare(bTime);
    });

  function formatSchedule(schedules: Discipline["schedules"]) {
    const dayMap: Record<number, string> = {
      1: "SEG",
      2: "TER",
      3: "QUA",
      4: "QUI",
      5: "SEX",
    };

    return schedules
      .map(
        (s) =>
          `${dayMap[s.dayOfWeek]} ${s.startTime.slice(0, 5)}-${s.endTime.slice(0, 5)}`,
      )
      .join(" | ");
  }

  return (
    <Box>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Minhas disciplinas ({enrolled.length})
        </h3>
        <a
          href="/fluxograma-curso.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto bg-[#205375] hover:bg-[#112b3c] text-white px-3 py-1.5 rounded transition-colors text-sm font-medium"
        >
          Ver Fluxograma
        </a>
      </div>

      {/* EMPTY */}
      {enrolled.length === 0 ? (
        <p className="text-xs text-gray-400">Nenhuma selecionada ainda 👀</p>
      ) : (
        <div className="flex flex-col gap-2">
          {enrolled.map((e) => {
            const d = e.discipline;

            return (
              <div
                key={e.id}
                className="flex items-center justify-between bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg"
              >
                {/* INFO */}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {d.name}
                  </span>

                  <span className="text-[11px] text-gray-500">
                    {formatSchedule(d.schedules)}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() => onComplete(d)}
                    title="Concluir"
                    className="w-7 h-7 rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white flex items-center justify-center transition"
                  >
                    <FiCheck size={14} />
                  </button>

                  <button
                    onClick={() => onToggle(d)}
                    title="Remover"
                    className="w-7 h-7 rounded-full bg-red-100 text-red-500 hover:bg-red-600 hover:text-white flex items-center justify-center transition"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Box>
  );
}
