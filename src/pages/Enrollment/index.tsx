import {
  FiAlertCircle,
  FiPrinter,
  FiBookOpen,
  FiCalendar,
  FiSearch,
  FiDownload,
  FiEye,
} from "react-icons/fi";
import LoadingPage from "@/components/LoadingPage";
import useToastLoading from "@/hooks/useToastLoading";
import { listDisciplines } from "@/services/discipline.service";
import {
  dropEnrollment,
  enrollStudent,
  listStudentEnrollments,
  updateEnrollmentStatus,
} from "@/services/enrollment.service";
import useUserStore from "@/stores/useUserStore";
import type { Discipline } from "@/types/discipline";
import type { Enrollment } from "@/types/enrollment";
import { isTimeOverlapping } from "@/utils/formatar";
import { generateEnrollmentPDF } from "@/utils/generateEnrollmentPDF";
import { useState, useEffect, useMemo } from "react";
import Box from "@/components/Box";
import DisciplineSelector from "./DisciplineSelector";
import WeeklyCalendar from "./WeeklyCalendar";
import FlowchartModal from "./FlowchartModal";
import clsx from "clsx";

export default function EnrollmentPage() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFlowchartModalOpen, setIsFlowchartModalOpen] = useState(false);
  const toast = useToastLoading();
  const user = useUserStore((s) => s.user);

  // Aba ativa: "disciplines" (Seleção) ou "schedule" (Grade Semanal)
  const [activeTab, setActiveTab] = useState<"disciplines" | "schedule">("disciplines");

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState<number | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PASSED" | "ENROLLED" | "AVAILABLE">(
    "ALL"
  );
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const enrolledDisciplines = useMemo(
    () => enrollments.filter((e) => e.status === "ENROLLED").map((e) => e.discipline),
    [enrollments]
  );

  const passedDisciplineIds = useMemo(
    () => enrollments.filter((e) => e.status === "PASSED").map((e) => e.disciplineId),
    [enrollments]
  );

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [allRes, enrolledRes] = await Promise.all([
        listDisciplines({ limit: 100 }),
        listStudentEnrollments(user.id),
      ]);

      if (allRes.success && allRes.data) setDisciplines(allRes.data.data);
      if (enrolledRes.success && enrolledRes.data) setEnrollments(enrolledRes.data);
    } catch {
      toast({ mensagem: "Erro ao carregar dados", tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const checkPrerequisites = (discipline: Discipline) => {
    if (!discipline.prerequisites || discipline.prerequisites.length === 0) return { ok: true };

    const missing = discipline.prerequisites.filter(
      (p) => !passedDisciplineIds.includes(p.prerequisiteId)
    );

    if (missing.length > 0) {
      return {
        ok: false,
        message: `Faltam pré-requisitos: ${missing.map((m) => m.prerequisite.name).join(", ")}`,
      };
    }
    return { ok: true };
  };

  const checkScheduleClash = (discipline: Discipline) => {
    for (const s1 of discipline.schedules) {
      for (const e2 of enrollments.filter((e) => e.status === "ENROLLED")) {
        if (e2.disciplineId === discipline.id) continue;
        for (const s2 of e2.discipline.schedules) {
          if (
            s1.dayOfWeek === s2.dayOfWeek &&
            isTimeOverlapping(s1.startTime, s1.endTime, s2.startTime, s2.endTime)
          ) {
            return {
              ok: false,
              message: `Choque de horário com ${e2.discipline.name}`,
            };
          }
        }
      }
    }
    return { ok: true };
  };

  const toggleSelection = async (discipline: Discipline) => {
    const enrollment = enrollments.find((e) => e.disciplineId === discipline.id);

    if (enrollment && (enrollment.status === "ENROLLED" || enrollment.status === "PASSED")) {
      const res = await dropEnrollment(enrollment.id);
      if (res.success) loadData();
      toast({ mensagem: res.message, tipo: res.type });
      return;
    }

    const prereqStatus = checkPrerequisites(discipline);
    if (!prereqStatus.ok) {
      toast({
        mensagem: prereqStatus.message || "Erro de pré-requisito",
        tipo: "error",
      });
      return;
    }

    const clashStatus = checkScheduleClash(discipline);
    if (!clashStatus.ok) {
      toast({
        mensagem: clashStatus.message || "Erro de choque de horário",
        tipo: "error",
      });
      return;
    }

    const res = await enrollStudent({
      studentId: user!.id,
      disciplineId: discipline.id,
      period: discipline.period,
    });

    if (res.success) loadData();
    toast({ mensagem: res.message, tipo: res.type });
  };

  const handleComplete = async (discipline: Discipline) => {
    const enrollment = enrollments.find((e) => e.disciplineId === discipline.id);
    if (!enrollment) return;
    const res = await updateEnrollmentStatus(enrollment.id, "PASSED");
    if (res.success) loadData();
    toast({ mensagem: res.message, tipo: res.type });
  };

  const handleGeneratePDF = () => {
    if (!user) return;
    generateEnrollmentPDF(
      { name: user.name, email: user.email },
      enrolledDisciplines
    );
  };

  const filteredDisciplines = useMemo(() => {
    return disciplines
      .filter((discipline) => {
        const enrollment = enrollments.find((e) => e.disciplineId === discipline.id);

        const isPassed = enrollment?.status === "PASSED";
        const isEnrolled = enrollment?.status === "ENROLLED";
        const isBlocked = isPassed || isEnrolled;
        const prereq = checkPrerequisites(discipline);
        const clash = checkScheduleClash(discipline);

        const canEnroll = !isBlocked && prereq.ok && clash.ok;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = discipline.name.toLowerCase().includes(q);
          const matchesCode = discipline.code?.toLowerCase().includes(q);
          if (!matchesName && !matchesCode) return false;
        }

        if (periodFilter !== "ALL" && discipline.period !== periodFilter) return false;
        if (statusFilter === "PASSED" && !isPassed) return false;
        if (statusFilter === "ENROLLED" && !isEnrolled) return false;
        if (statusFilter === "AVAILABLE" && !canEnroll) return false;
        if (onlyAvailable && !canEnroll) return false;

        return true;
      })
      .sort((a, b) => a.period - b.period);
  }, [disciplines, enrollments, searchQuery, periodFilter, statusFilter, onlyAvailable]);

  if (loading) return <LoadingPage />;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* CABEÇALHO DA MATRÍCULA ONLINE COM AÇÕES */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-linear-to-br from-orange-500 via-orange-600 to-amber-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <FiBookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
              Matrícula Online & Grade de Aulas
              <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                {enrolledDisciplines.length} Cursando
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
              Selecione as matérias do seu semestre, consulte seus horários e emita o comprovante oficial.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsFlowchartModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-xs active:scale-95 cursor-pointer"
          >
            <FiEye className="w-4 h-4 text-orange-500" />
            Fluxograma Curricular
          </button>

          <button
            type="button"
            onClick={handleGeneratePDF}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <FiPrinter className="w-4 h-4" />
            Gerar Comprovante PDF
          </button>
        </div>
      </div>

      {/* NAVEGAÇÃO EM ABAS (TABS RESPONSIVAS) */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTab("disciplines")}
          className={clsx(
            "flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial",
            activeTab === "disciplines"
              ? "border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/30 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          <FiBookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Seleção de Disciplinas
          <span className="px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[9px] sm:text-[10px] text-slate-700 dark:text-slate-300 font-extrabold">
            {filteredDisciplines.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("schedule")}
          className={clsx(
            "flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-initial",
            activeTab === "schedule"
              ? "border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/30 rounded-t-xl"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          <FiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Minha Grade Semanal
          {enrolledDisciplines.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[9px] sm:text-[10px] font-extrabold">
              {enrolledDisciplines.length}
            </span>
          )}
        </button>
      </div>

      {/* CONTEÚDO DA ABA 1: SELEÇÃO DE DISCIPLINAS */}
      {activeTab === "disciplines" && (
        <div className="space-y-5">
          {/* BARRA DE BUSCA E FILTROS */}
          <Box className="p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* BUSCA POR NOME OU CÓDIGO */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar disciplina por nome ou código..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={periodFilter}
                  onChange={(e) =>
                    setPeriodFilter(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
                  }
                  className="border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">Todos os Semestres</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                    <option key={p} value={p}>
                      {p}º período
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ALL">Todas as Situações</option>
                  <option value="ENROLLED">Matriculadas</option>
                  <option value="PASSED">Concluídas</option>
                  <option value="AVAILABLE">Disponíveis</option>
                </select>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer px-1">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  Posso cursar
                </label>
              </div>
            </div>
          </Box>

          {/* LISTA COMPLETA DE DISCIPLINAS */}
          <Box className="p-6">
            <DisciplineSelector
              disciplines={filteredDisciplines}
              enrollments={enrollments}
              onToggle={toggleSelection}
              onComplete={handleComplete}
              checkPrerequisites={checkPrerequisites}
              checkScheduleClash={checkScheduleClash}
            />
          </Box>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: MINHA GRADE SEMANAL */}
      {activeTab === "schedule" && (
        <div className="space-y-4">
          <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 p-4 rounded-2xl flex items-center justify-between gap-4 text-sky-800 dark:text-sky-200 text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="shrink-0 text-sky-600 dark:text-sky-400" size={20} />
              <p className="leading-relaxed">
                Esta é a sua grade horária de aulas semanal atualizada em tempo real com base nas disciplinas em que você se matriculou.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGeneratePDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              <FiPrinter className="w-3.5 h-3.5" />
              Imprimir Grade
            </button>
          </div>

          <div className="min-h-[500px]">
            <WeeklyCalendar selectedDisciplines={[]} enrolledDisciplines={enrolledDisciplines} />
          </div>
        </div>
      )}

      {/* MODAL DE VISUALIZAÇÃO E DOWNLOAD DO FLUXOGRAMA */}
      <FlowchartModal
        isOpen={isFlowchartModalOpen}
        onClose={() => setIsFlowchartModalOpen(false)}
      />
    </div>
  );
}
