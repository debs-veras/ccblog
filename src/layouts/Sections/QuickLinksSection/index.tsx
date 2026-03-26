import { FaUtensils } from "react-icons/fa";
import { FiCalendar, FiExternalLink, FiLogIn, FiGlobe } from "react-icons/fi";

const links = [
  {
    title: "Calendário Acadêmico",
    description: "Datas importantes do semestre",
    url: "https://ww2.uva.ce.gov.br/apps/view/listagem_documentos.php?buscar=0105",
    icon: FiCalendar,
  },
  {
    title: "Site da UVA",
    description: "Portal oficial da universidade",
    url: "https://www.uva.ce.gov.br",
    icon: FiGlobe,
  },
  {
    title: "Sistema Acadêmico",
    description: "Acesse notas, disciplinas e matrícula",
    url: "https://autenticacao.uvanet.br/autenticacao/pages/login.jsf",
    icon: FiLogIn,
  },
  {
    title: "Restaurante Universitário",
    description: "Cardápio e informações do RU",
    url: "https://www.uva.ce.gov.br/imprensa/servicos/ru/",
    icon: FaUtensils   ,
  },
];

export default function QuickLinksSection() {
  return (
    <section className="w-full max-w-7xl mx-auto my-12">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-xl font-bold text-[#112b3c] dark:text-white md:text-2xl">
          Acesso Rápido
        </h2>
        <p className="text-sm text-[#B4B3B2]">
          Links úteis para o dia a dia acadêmico
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {links.map((item, index) => {
          const Icon = item.icon;

          return (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-5 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-md transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-[#205375]/10 dark:bg-sky-500/10 text-[#205375] dark:text-sky-400 transition-colors duration-500">
                  <Icon size={20} />
                </div>

                <FiExternalLink className="text-gray-400 dark:text-gray-500 group-hover:text-[#205375] dark:group-hover:text-sky-400 transition-colors duration-300" />
              </div>

              <h3 className="font-semibold text-[#112b3c] dark:text-white mb-1 transition-colors duration-500">
                {item.title}
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-500">
                {item.description}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
