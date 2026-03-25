import { useState, useEffect, useMemo } from "react";
import { listDisciplines } from "../../services/discipline.service";
import {
  listStudentEnrollments,
  enrollStudent,
  dropEnrollment,
  updateEnrollmentStatus,
} from "../../services/enrollment.service";
import type { Discipline } from "../../types/discipline";
import type { Enrollment } from "../../types/enrollment";
import { useStorage } from "../../hooks/storage";
import useToastLoading from "../../hooks/useToastLoading";
import LoadingPage from "../../components/LoadingPage";
import WeeklyCalendar from "./WeeklyCalendar";
import DisciplineSelector from "./DisciplineSelector";
import { FiAlertCircle } from "react-icons/fi";
import { isTimeOverlapping } from "../../utils/formatar";
import EnrolledDisciplines from "./EnrolledDisciplines";
import Box from "../../components/UI/Box";

export default function EnrollmentPage() {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { getUser } = useStorage();
  const toast = useToastLoading();
  const user = getUser();
  // filtros
  const [periodFilter, setPeriodFilter] = useState<number | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PASSED" | "ENROLLED" | "AVAILABLE"
  >("ALL");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const enrolledDisciplines = useMemo(
    () =>
      enrollments
        .filter((e) => e.status === "ENROLLED")
        .map((e) => e.discipline),
    [enrollments],
  );

  const passedDisciplineIds = useMemo(
    () =>
      enrollments
        .filter((e) => e.status === "PASSED")
        .map((e) => e.disciplineId),
    [enrollments],
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
      if (enrolledRes.success && enrolledRes.data)
        setEnrollments(enrolledRes.data);
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
    if (!discipline.prerequisites || discipline.prerequisites.length === 0)
      return { ok: true };

    const missing = discipline.prerequisites.filter(
      (p) => !passedDisciplineIds.includes(p.prerequisiteId),
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
            isTimeOverlapping(
              s1.startTime,
              s1.endTime,
              s2.startTime,
              s2.endTime,
            )
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
    const enrollment = enrollments.find(
      (e) => e.disciplineId === discipline.id,
    );

    if (
      enrollment &&
      (enrollment.status === "ENROLLED" || enrollment.status === "PASSED")
    ) {
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
    const enrollment = enrollments.find(
      (e) => e.disciplineId === discipline.id,
    );
    if (!enrollment) return;
    const res = await updateEnrollmentStatus(enrollment.id, "PASSED");
    if (res.success) loadData();
    toast({ mensagem: res.message, tipo: res.type });
  };

  const filteredDisciplines = useMemo(() => {
    return disciplines
      .filter((discipline) => {
        const enrollment = enrollments.find(
          (e) => e.disciplineId === discipline.id,
        );

        const isPassed = enrollment?.status === "PASSED";
        const isEnrolled = enrollment?.status === "ENROLLED";
        const isBlocked = isPassed || isEnrolled;
        const prereq = checkPrerequisites(discipline);
        const clash = checkScheduleClash(discipline);

        const canEnroll = !isBlocked && prereq.ok && clash.ok;
        if (periodFilter !== "ALL" && discipline.period !== periodFilter)
          return false;
        if (statusFilter === "PASSED" && !isPassed) return false;
        if (statusFilter === "ENROLLED" && !isEnrolled) return false;
        if (statusFilter === "AVAILABLE" && !canEnroll) return false;
        if (onlyAvailable && !canEnroll) return false;

        return true;
      })
      .sort((a, b) => a.period - b.period);
  }, [disciplines, enrollments, periodFilter, statusFilter, onlyAvailable]);

  if (loading) return <LoadingPage />;

  return (
    <>
      <EnrolledDisciplines
        enrollments={enrollments}
        onToggle={toggleSelection}
        onComplete={handleComplete}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-2 lg:gap-4 mt-4">
        <Box>
          <div className="flex flex-wrap gap-2 mb-4">
            <select
              value={periodFilter}
              onChange={(e) =>
                setPeriodFilter(
                  e.target.value === "ALL" ? "ALL" : Number(e.target.value),
                )
              }
              className="border px-2 py-1 rounded text-sm"
            >
              <option value="ALL">Todos</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                <option key={p} value={p}>
                  {p}º período
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border px-2 py-1 rounded text-sm"
            >
              <option value="ALL">Todas</option>
              <option value="ENROLLED">Matriculadas</option>
              <option value="PASSED">Concluídas</option>
              <option value="AVAILABLE">Disponíveis</option>
            </select>

            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
              />
              Posso cursar
            </label>
          </div>

          <DisciplineSelector
            disciplines={filteredDisciplines}
            enrollments={enrollments}
            onToggle={toggleSelection}
            onComplete={handleComplete}
            checkPrerequisites={checkPrerequisites}
            checkScheduleClash={checkScheduleClash}
          />
        </Box>

        <div className="flex flex-col gap-4 min-h-125 h-auto lg:h-auto">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3 text-blue-700 text-sm">
            <FiAlertCircle className="shrink-0" size={20} />
            <p>
              Ao selecionar uma disciplina, sua matrícula será realizada
              instantaneamente. Você pode remover ou concluir disciplinas
              diretamente na lista lateral.
            </p>
          </div>
          <div className="flex-1 min-h-0">
            <WeeklyCalendar
              selectedDisciplines={[]}
              enrolledDisciplines={enrolledDisciplines}
            />
          </div>
        </div>
      </div>
    </>
  );
}
