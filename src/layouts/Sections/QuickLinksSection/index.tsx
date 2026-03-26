import { FaUtensils } from "react-icons/fa";
import { FiCalendar, FiExternalLink, FiLogIn, FiGlobe } from "react-icons/fi";
import { motion } from "framer-motion";

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
    icon: FaUtensils,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

export default function QuickLinksSection() {
  return (
    <section className="w-full container mx-auto mt-0 sm:-mt-24 relative z-20 ">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="flex flex-col gap-2 mb-8 px-4"
      >
        <span className="text-[10px] sm:text-xs font-mono text-orange-500 font-bold uppercase tracking-[0.3em]">
          ACESSOS_RÁPIDOS
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
          Facilitação Acadêmica
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 "
      >
        {links.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.a
              key={index}
              variants={itemVariants}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-3xl border-2 border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/50 backdrop-blur-md sm:backdrop-blur-xl hover:border-orange-500/50 dark:hover:border-orange-500/50 shadow-xl shadow-slate-200/10 dark:shadow-slate-950/50 transition-all duration-500 hover:-translate-y-2 flex flex-col items-start will-change-transform"
            >
              <div className="w-full flex items-center justify-between mb-6">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:border-orange-500/20 transition-all duration-500">
                  <Icon size={22} strokeWidth={2.5} />
                </div>

                <div className="p-2 rounded-xl opacity-0 group-hover:opacity-100 bg-orange-500/10 text-orange-500 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                  <FiExternalLink size={16} />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white transition-colors duration-500">
                  {item.title}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors duration-500 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 w-full h-1 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div className="w-0 group-hover:w-full h-full bg-linear-to-r from-orange-600 to-amber-500 transition-all duration-700 ease-out" />
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </section>
  );
}
