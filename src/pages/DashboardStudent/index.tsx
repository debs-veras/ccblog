import { useEffect, useState } from "react";
import {
  HiBookOpen,
  HiCalendar,
  HiCheckCircle,
  HiClock,
  HiTrendingUp,
} from "react-icons/hi";
import Box from "../../components/UI/Box";
import useToastLoading from "../../hooks/useToastLoading";
import type { StudentDashboard } from "../../types/dashboard";
import type { Discipline } from "../../types/discipline";
import { getDashboardStudent } from "../../services/dashboard.service";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const toast = useToastLoading();

  const [data, setData] = useState<StudentDashboard>({
    enrolledDisciplines: [],
    completedDisciplines: [],
    upcomingClasses: [],
    progress: 0,
    totalCourseDisciplines: 0,
    totalCompleted: 0,
    totalRemaining: 0,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const response = await getDashboardStudent();

      if (response.success && response.data) setData(response.data);
      else {
        toast({
          mensagem: response.message,
          tipo: response.type,
        });
      }

      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const days = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  const scheduleMap: Record<
    number,
    { name: string; startTime: string; endTime: string; teacher: string }[]
  > = {};

  data.enrolledDisciplines.forEach((d: Discipline) => {
    d.schedules?.forEach((s: { dayOfWeek: number; startTime: string; endTime: string }) => {
      if (!scheduleMap[s.dayOfWeek]) scheduleMap[s.dayOfWeek] = [];

      scheduleMap[s.dayOfWeek].push({
        name: d.name,
        startTime: s.startTime,
        endTime: s.endTime,
        teacher: d.teacher.name,
      });
    });
  });

  Object.keys(scheduleMap).forEach((day) => {
    scheduleMap[Number(day)].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );
  });

  return (
    <>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Fazendo agora"
            value={data.enrolledDisciplines.length}
            icon={<HiBookOpen />}
            gradient="from-blue-500 to-blue-600"
          />

          <StatCard
            title="Concluídas"
            value={`${data.totalCompleted} / ${data.totalCourseDisciplines}`}
            icon={<HiCheckCircle />}
            gradient="from-green-500 to-green-600"
          />

          <StatCard
            title="Progresso do Curso"
            value={`${data.progress}%`}
            icon={<HiTrendingUp />}
            gradient="from-purple-500 to-purple-600"
          />
        </div>

        {/* Próximas aulas */}
        <Box loading={loading}>
          <h2 className="text-xl font-semibold dark:text-white flex items-center gap-2">
            <HiClock className="text-blue-500" />
            Próximas Aulas
          </h2>

          <div className="space-y-4">
            {data.upcomingClasses.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-10 bg-blue-500 rounded-full" />

                  <div>
                    <p className="font-semibold dark:text-white">{c.discipline}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{c.teacher}</p>
                  </div>
                </div>

                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {c.startTime} - {c.endTime}
                </span>
              </div>
            ))}

            {data.upcomingClasses.length === 0 && (
              <p className="text-center text-gray-400">Nenhuma aula hoje</p>
            )}
          </div>
        </Box>

        {/* Calendário */}
        <Box loading={loading}>
          <h2 className="text-xl font-semibold dark:text-white flex items-center gap-2">
            <HiCalendar className="text-blue-500" />
            Calendário Semanal
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {days.slice(0, 5).map((day, index) => {
              const dayIndex = index + 1;

              return (
                <div
                  key={day}
                  className="rounded-2xl p-4 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <h3 className="text-center font-semibold text-gray-700 dark:text-gray-200 mb-4">
                    {day} 
                  </h3>

                  <div className="space-y-3">
                    {(scheduleMap[dayIndex] || []).map((item, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800"
                      >
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.startTime} - {item.endTime}
                        </p>
                        <p className="text-xs text-gray-500">{item.teacher}</p>
                      </div>
                    ))}

                    {(scheduleMap[dayIndex] || []).length === 0 && (
                      <p className="text-xs text-gray-400 text-center">
                        Sem aulas
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Box>
      </div>
    </>
  );
}

function StatCard({ title, value, icon, gradient }: { title: string; value: string | number; icon: React.ReactNode; gradient: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>

        <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl text-xl">
          {icon}
        </div>
      </div>

      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
    </div>
  );
}
