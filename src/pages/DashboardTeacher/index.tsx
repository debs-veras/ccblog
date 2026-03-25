import { useEffect, useState } from "react";
import {
  HiBookOpen,
  HiUsers,
  HiDocumentText,
  HiEye,
  HiTrendingUp,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import Box from "../../components/UI/Box";
import { getDashboardTeacher } from "../../services/dashboard.service";
import useToastLoading from "../../hooks/useToastLoading";
import type { TeacherDashboard } from "../../types/dashboard";

export default function DashboardTeacher() {
  const [loading, setLoading] = useState(true);
  const toast = useToastLoading();

  const [data, setData] = useState<TeacherDashboard>({
    totalDisciplines: 0,
    totalStudents: 0,
    totalPosts: 0,
    totalViews: 0,
    topPosts: [],
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const response = await getDashboardTeacher();
      if (response.success && response.data) setData(response.data);
      else {
        toast({
          mensagem: response.message || "Erro ao carregar dashboard",
          tipo: response.type,
        });
      }

      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Minhas Disciplinas"
          value={data.totalDisciplines}
          icon={<HiBookOpen />}
          gradient="from-blue-500 to-cyan-600"
        />

        <StatCard
          title="Alunos Matriculados"
          value={data.totalStudents}
          icon={<HiUsers />}
          gradient="from-purple-500 to-indigo-600"
        />

        <StatCard
          title="Posts Publicados"
          value={data.totalPosts}
          icon={<HiDocumentText />}
          gradient="from-orange-500 to-red-600"
        />

        <StatCard
          title="Visualizações Totais"
          value={data.totalViews}
          icon={<HiEye />}
          gradient="from-green-500 to-emerald-600"
        />
      </div>

      {/* Top Posts */}
      <Box loading={loading}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <HiTrendingUp className="text-[#f66b0e]" />
            Posts Mais Acessados
          </h2>
          <Link
            to="/meus-posts"
            className="text-sm font-medium text-[#205375] dark:text-blue-400 hover:underline"
          >
            Ver todos
          </Link>
        </div>

        <div className="space-y-4">
          {data.topPosts.length > 0 ? (
            data.topPosts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow group"
              >
                <div className="flex flex-col mb-2 sm:mb-0">
                  <Link
                    to={`/noticias/${post.slug}`}
                    className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-[#205375] dark:group-hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </Link>
                  <span className="text-xs text-gray-500 mt-1">
                    Publicado em {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <HiEye className="text-gray-400" size={16} />
                  {post.views} vis.
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              Você ainda não tem posts publicados ou acessados.
            </div>
          )}
        </div>
      </Box>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  gradient: string;
}

function StatCard({ title, value, icon, gradient }: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 text-white bg-linear-to-br ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-90 font-medium tracking-wide">{title}</p>
          <h2 className="text-3xl font-black mt-2 tracking-tight">{value}</h2>
        </div>

        <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl text-2xl shadow-inner">
          {icon}
        </div>
      </div>

      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -top-6 -left-6 w-16 h-16 bg-white/10 rounded-full blur-xl" />
    </div>
  );
}
