import { SectionHeader } from "../../components/SectionHeader";
import useToastLoading from "../../hooks/useToastLoading";
import { handleCopy } from "../../utils/formatar";

export default function ComplementaryActivities() {
  const toast = useToastLoading();

  return (
    <section className="mx-auto pt-24 sm:pt-32 pb-16 w-full max-w-7xl space-y-10 px-4 sm:px-6">
      {/* HEADER */}
      <SectionHeader
        title="Atividades Complementares"
        description="Entenda como validar suas horas e quais atividades são aceitas"
      />

      {/* CARGA HORÁRIA */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border dark:border-slate-800 p-5 shadow-sm bg-white dark:bg-slate-900/50 transition-all duration-500">
          <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-500">Fluxo 2012</p>
          <h2 className="text-2xl font-bold text-[#205375] dark:text-sky-400 transition-colors duration-500">60h</h2>
        </div>

        <div className="rounded-xl border dark:border-slate-800 p-5 shadow-sm bg-white dark:bg-slate-900/50 transition-all duration-500">
          <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-500">Fluxo 2016</p>
          <h2 className="text-2xl font-bold text-[#205375] dark:text-sky-400 transition-colors duration-500">100h</h2>
        </div>

        <div className="rounded-xl border dark:border-slate-800 p-5 shadow-sm bg-white dark:bg-slate-900/50 transition-all duration-500">
          <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-500">Outros fluxos</p>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 transition-colors duration-500">
            Não obrigatório
          </h2>
        </div>
      </div>

      {/* COMO COMPROVAR */}
      <div className="rounded-xl border dark:border-slate-800 p-6 shadow-sm bg-white dark:bg-slate-900/50 transition-all duration-500">
        <h2 className="mb-2 text-lg font-semibold text-[#112b3c] dark:text-white transition-colors duration-500">
          Como comprovar
        </h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 transition-colors duration-500">
          Envie certificados, declarações ou diplomas para o coordenador dentro
          do prazo estabelecido. Apenas documentos válidos serão considerados.
        </p>
      </div>

      {/* TIPOS */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* ENSINO */}
        <div className="group rounded-xl border dark:border-slate-800 p-6 shadow-sm transition-all duration-500 hover:shadow-md bg-white dark:bg-slate-900/40">
          <h3 className="mb-3 text-lg font-semibold text-[#205375] dark:text-sky-400 transition-colors duration-500">Ensino</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
            <li>• Disciplinas fora da grade</li>
            <li>• Língua estrangeira</li>
            <li>• Monitoria</li>
            <li>• Estágios extracurriculares</li>
            <li>• Cursos e oficinas</li>
          </ul>
        </div>

        {/* PESQUISA */}
        <div className="group rounded-xl border dark:border-slate-800 p-6 shadow-sm transition-all duration-500 hover:shadow-md bg-white dark:bg-slate-900/40">
          <h3 className="mb-3 text-lg font-semibold text-[#205375] dark:text-sky-400 transition-colors duration-500">
            Pesquisa
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
            <li>• Trabalhos científicos</li>
            <li>• Publicações</li>
            <li>• Resumos acadêmicos</li>
            <li>• Projetos aprovados</li>
            <li>• Iniciação científica</li>
          </ul>
        </div>

        {/* EXTENSÃO */}
        <div className="group rounded-xl border dark:border-slate-800 p-6 shadow-sm transition-all duration-500 hover:shadow-md bg-white dark:bg-slate-900/40">
          <h3 className="mb-3 text-lg font-semibold text-[#205375] dark:text-sky-400 transition-colors duration-500">
            Extensão
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
            <li>• Eventos e palestras</li>
            <li>• Oficinas</li>
            <li>• Projetos sociais</li>
            <li>• Empresa júnior</li>
            <li>• Representação estudantil</li>
          </ul>
        </div>
      </div>

      {/* REGRA */}
      <div className="rounded-xl border-l-4 border-[#205375] dark:border-sky-500 bg-[#205375]/5 dark:bg-slate-900/60 p-6 transition-all duration-500">
        <h2 className="mb-2 text-lg font-semibold text-[#112b3c] dark:text-white transition-colors duration-500">
          Regra importante
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-500">
          É obrigatório cumprir no mínimo{" "}
          <span className="font-bold text-[#205375] dark:text-sky-400">20 horas por grupo</span>{" "}
          (Ensino, Pesquisa e Extensão), até atingir a carga total exigida.
        </p>
      </div>

      {/* CONTATO */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border dark:border-slate-800 p-6 shadow-sm bg-white dark:bg-slate-950/40 sm:flex-row sm:items-center transition-all duration-500">
        <div>
          <h2 className="text-lg font-semibold text-[#112b3c] dark:text-white transition-colors duration-500">Dúvidas?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
            Entre em contato com o coordenador responsável
          </p>
        </div>

        <button
          onClick={() => handleCopy("eder_porfirio@uvanet.br", toast)}
          className="rounded-md bg-[#205375] dark:bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:opacity-90 active:scale-95 cursor-pointer"
        >
          eder_porfirio@uvanet.br
        </button>
      </div>
    </section>
  );
}
