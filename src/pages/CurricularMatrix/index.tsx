import { useState, useEffect, useMemo } from "react";
import { FiChevronDown, FiMail, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { listDisciplines } from "../../services/discipline.service";
import type { Discipline } from "../../types/discipline";
import useToastLoading from "../../hooks/useToastLoading";
import LoadingPage from "../../components/LoadingPage";
import { SectionHeader } from "../../components/SectionHeader";

type Periodo = {
  titulo: string;
  disciplinas: Discipline[];
};

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function MatrizCurricular() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToastLoading();

  const loadDisciplines = async () => {
    setLoading(true);
    const response = await listDisciplines();

    if (response.success && response.data) {
      setDisciplines(response.data.data);
    } else {
      toast({ mensagem: response.message, tipo: response.type });
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDisciplines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const matriz = useMemo(() => {
    const periods: Periodo[] = [];

    if (!Array.isArray(disciplines)) return periods;

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

  const cargas = [
    { label: "Obrigatórias", valor: 2700 },
    { label: "Optativas", valor: 420 },
    { label: "Atividades Complementares", valor: 100 },
  ];

  const total = 3200;

  if (loading) return <LoadingPage />;

  return (
    <section className="mx-auto my-12 w-full max-w-7xl space-y-10 px-4 sm:px-6">
      <SectionHeader
        title="Matriz Curricular"
        description="Estrutura com disciplinas, cargas e horários"
      />

      {/* INFO */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Duração", value: "4 - 4.5 anos" },
          { title: "Carga Total", value: `${total}h` },
          { title: "Modalidade", value: "Bacharelado" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
            <h3 className="text-xl font-bold text-[#205375] dark:text-blue-300">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* DISTRIBUIÇÃO */}
      <div>
        <h2 className="text-2xl font-bold text-[#112b3c] dark:text-white mb-4">
          Distribuição da Carga
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {cargas.map((c, i) => {
            const pct = total > 0 ? (c.valor / total) * 100 : 0;

            return (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-sm dark:text-gray-200">{c.label}</span>
                  <span className="font-bold dark:text-white">{c.valor}h</span>
                </div>

                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <div
                    className="h-2 bg-[#205375] dark:bg-blue-500 rounded"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1">{pct.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* MATRIZ */}
      <div>
        <h2 className="text-2xl font-bold text-[#112b3c] dark:text-white mb-4">
          Estrutura por Semestre
        </h2>

        {matriz.map((p, i) => {
          const isOpen = openIndex === i;
          const cargaTotal = p.disciplinas.reduce(
            (acc, d) => acc + Number(d.workload),
            0,
          );

          return (
            <div
              key={i}
              className="mb-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <div className="text-left">
                  <p className="font-semibold text-[#205375] dark:text-blue-300">{p.titulo}</p>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    {cargaTotal}h no semestre{" "}
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                      {p.disciplinas.length} disciplinas
                    </span>
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-gray-400"
                >
                  <FiChevronDown />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="p-5 space-y-4">
                      {p.disciplinas.map((d, idx) => {
                        const groupedSchedules = Object.values(
                          (d.schedules || []).reduce((acc, s) => {
                            const key = `${s.startTime}-${s.endTime}`;
                            if (!acc[key]) acc[key] = { ...s, days: [] };
                            acc[key].days.push(weekDays[s.dayOfWeek]);
                            return acc;
                          }, {} as Record<string, { startTime: string; endTime: string; days: string[] }>),
                        );

                        return (
                          <div
                            key={idx}
                            className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                                {d.name}
                              </h4>

                              <span className="text-xs font-bold bg-[#205375]/10 dark:bg-[#205375]/20 text-[#205375] dark:text-blue-300 px-2 py-1 rounded-md">
                                {d.workload}h
                              </span>
                            </div>

                            {d.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {d.description}
                              </p>
                            )}

                            {/* HORÁRIOS */}
                            {groupedSchedules.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {groupedSchedules.map((g: { startTime: string; endTime: string; days: string[] }, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] font-medium bg-[#205375]/10 text-[#205375] px-2 py-1 rounded-md"
                                  >
                                    {g.days.join(", ")} •{" "}
                                    {g.startTime.slice(0, 5)} -{" "}
                                    {g.endTime.slice(0, 5)}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* PRÉ-REQUISITOS */}
                            <p className="text-[10px] text-gray-400 uppercase mt-3">
                              Pré-requisitos:{" "}
                              {d.prerequisites?.length
                                ? d.prerequisites
                                    .map((pr) => pr.prerequisite.name)
                                    .join(", ")
                                : "Nenhum"}
                            </p>

                            {/* INFO PROFESSOR */}
                            {(d.teacher || d.materialUrl) && (
                              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-[10px] text-gray-400 uppercase mb-2">
                                  Informações Adicionais
                                </p>

                                <div className="flex justify-between items-center flex-wrap gap-2">
                                  {d.teacher && (
                                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200">
                                      <FiUser className="text-[#205375] dark:text-blue-400" />
                                      {d.teacher.name}
                                    </div>
                                  )}

                                  <div className="flex flex-wrap gap-3">
                                    {d.teacher?.email && (
                                      <a
                                        href={`mailto:${d.teacher.email}`}
                                        className="text-xs text-[#205375] dark:text-blue-400 hover:underline"
                                      >
                                        <FiMail className="inline mr-1" />
                                        {d.teacher.email}
                                      </a>
                                    )}

                                    {d.materialUrl && (
                                      <a
                                        href={d.materialUrl}
                                        target="_blank"
                                        className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
                                      >
                                        Material →
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {matriz.length === 0 && (
          <div className="text-center py-10 bg-gray-50 rounded-xl border-dashed border">
            Nenhuma disciplina cadastrada.
          </div>
        )}
      </div>
    </section>
  );
}
