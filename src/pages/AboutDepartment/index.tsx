import {
  FiMail,
  FiPhone,
  FiExternalLink,
  FiCopy,
} from "react-icons/fi";
import { SectionHeader } from "../../components/SectionHeader";
import { handleCopy } from "../../utils/formatar";
import useToastLoading from "../../hooks/useToastLoading";

export default function AboutDepartment() {
  const toast = useToastLoading();
  const professors = [
    { name: "Hudson", email: "hudson_costa@uvanet.br" },
    { name: "Cláudio", email: "claudio_carvalho@uvanet.br" },
    { name: "Lorena", email: "lorena_pierre@uvanet.br" },
    { name: "Márcio", email: "marcio_rocha@uvanet.br" },
    { name: "Plácido", email: "placido_dias@uvanet.br" },
    { name: "Thales", email: "andrade_thales@uvanet.br" },
    { name: "Walisson", email: "walisson_pereira@uvanet.br" },
    { name: "Gilzamir", email: "gilzamir_gomes@uvanet.br" },
    { name: "Paulo Regis", email: "paulo_regis@uvanet.br" },
    { name: "Eder", email: "eder_porfirio@uvanet.br" },
    { name: "Alex", email: "alex_pontes@uvanet.br" },
    { name: "Lourival", email: "lourival_junior@uvanet.br" },
  ];

  return (
    <section className="mx-auto my-12 w-full max-w-7xl space-y-12 px-4 sm:px-6">
      {/* HEADER + CTA */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Centro Acadêmico & Coordenação"
          description="Informações oficiais, equipe responsável e formas de contato"
        />

        <a
          href="https://www.uva.ce.gov.br/cursos/cursos-graduacao/cg-computacao/"
          target="_blank"
          className="flex items-center gap-2 rounded-md bg-[#205375] dark:bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
        >
          Saiba mais sobre o curso
          <FiExternalLink size={16} />
        </a>
      </div>

      {/* COORDENAÇÃO */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border dark:border-slate-800 bg-linear-to-br from-white to-[#f8fafc] dark:from-slate-900/50 dark:to-slate-950/50 p-6 shadow-sm hover:shadow-md transition-all duration-500">
          <h2 className="mb-4 text-lg font-semibold text-[#112b3c] dark:text-white transition-colors duration-500">
            Coordenação
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Coordenador</p>
              <p className="font-medium text-[#205375] dark:text-sky-400 transition-colors duration-500">
                Hudson Costa Gonçalves da Cruz
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-500">Coordenador Adjunto</p>
              <p className="font-medium text-[#205375] dark:text-sky-400 transition-colors duration-500">
                José Alex Pontes Martins
              </p>
            </div>
          </div>
        </div>

        {/* FUNCIONAMENTO */}
        <div className="rounded-2xl border dark:border-slate-800 bg-linear-to-br from-white to-[#f8fafc] dark:from-slate-900/50 dark:to-slate-950/50 p-6 shadow-sm hover:shadow-md transition-all duration-500">
          <h2 className="mb-4 text-lg font-semibold text-[#112b3c] dark:text-white transition-colors duration-500">
            Funcionamento
          </h2>

          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-500">
            <p>
              <span className="font-medium text-[#205375] dark:text-sky-400 transition-colors duration-500">Turnos:</span> Manhã,
              Tarde e Noite
            </p>

            <p>
              <span className="font-medium text-[#205375] dark:text-sky-400 transition-colors duration-500">Local:</span> Campus
              da CIDAO
            </p>

            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed transition-colors duration-500">
              Av. Dr. Guarany, 535 – Jocely Dantas
              <br />
              Sobral – CE, 62042-030
            </p>
          </div>
        </div>
      </div>

      {/* CONTATO */}
      <div className="rounded-2xl border dark:border-slate-800 bg-[#205375]/5 dark:bg-slate-900/40 p-6 shadow-sm transition-all duration-500">
        <h2 className="mb-4 text-lg font-semibold text-[#112b3c] dark:text-white transition-colors duration-500">Contato</h2>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 transition-colors duration-500">
              <FiMail />
              computacao_coordenacao@uvanet.br
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 transition-colors duration-500">
              <FiPhone />
              (88) 3677-4222
            </div>
          </div>

          <button
            onClick={() =>
              handleCopy("computacao_coordenacao@uvanet.br", toast)
            }
            className="rounded-md bg-[#205375] dark:bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer"
          >
            Copiar email
          </button>
        </div>
      </div>

      {/* PROFESSORES */}

      <div className="rounded-2xl border dark:border-slate-800 p-6 shadow-sm transition-all duration-500">
        <h2 className="mb-6 text-xl font-semibold text-[#112b3c] dark:text-white transition-colors duration-500">
          Professores
        </h2>

        <ul className="divide-y dark:divide-slate-800 transition-colors duration-500">
          {professors.map((prof, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-4 text-sm"
            >
              {/* NOME */}
              <div className="flex flex-col">
                <span className="font-medium text-[#205375] dark:text-sky-400 transition-colors duration-500">{prof.name}</span>

                <span className="text-gray-500 dark:text-gray-400 text-xs transition-colors duration-500">Professor(a)</span>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 transition-colors duration-500">
                  <FiMail size={14} />
                  <span className="hidden sm:block">{prof.email}</span>
                </div>

                <button
                  onClick={() => handleCopy(prof.email, toast)}
                  className="text-[#205375] dark:text-sky-400 hover:scale-125 transition-all duration-300 cursor-pointer"
                >
                  <FiCopy />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* CENTRO ACADÊMICO */}
      <div className="rounded-2xl border dark:border-slate-800 p-6 shadow-sm transition-all duration-500">
        <h2 className="mb-4 text-lg font-semibold text-[#112b3c] dark:text-white transition-colors duration-500">
          Centro Acadêmico
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-500">
          O Centro Acadêmico representa os estudantes, organiza eventos e atua
          como ponte entre alunos e coordenação.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {["Presidente", "Vice-presidente", "Tesoureiro", "Secretário"].map(
            (role, i) => (
              <div
                key={i}
                className="rounded-lg border dark:border-slate-800 p-4 text-sm text-center bg-white dark:bg-slate-900/40 hover:bg-[#205375]/5 dark:hover:bg-slate-800 transition-all duration-300"
              >
                <p className="font-medium text-[#205375] dark:text-sky-400 transition-colors duration-500">{role}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-500">Nome do integrante</p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
