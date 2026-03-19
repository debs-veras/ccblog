import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiExternalLink,
  FiCheck,
  FiCopy,
} from "react-icons/fi";
import { SectionHeader } from "../../components/SectionHeader";

export default function AboutDepartment() {
  const [copied, setCopied] = useState(false);
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
  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText("computacao_coordenacao@uvanet.br");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mx-auto my-12 w-full max-w-6xl space-y-12 px-4 sm:px-6">
      {/* HEADER + CTA */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="Centro Acadêmico & Coordenação"
          description="Informações oficiais, equipe responsável e formas de contato"
        />

        <a
          href="https://www.uva.ce.gov.br/cursos/cursos-graduacao/cg-computacao/"
          target="_blank"
          className="flex items-center gap-2 rounded-md bg-[#205375] px-4 py-2 text-sm font-medium text-white transition hover:scale-105 hover:shadow-md"
        >
          Saiba mais sobre o curso
          <FiExternalLink size={16} />
        </a>
      </div>

      {/* COORDENAÇÃO */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-gradient-to-br from-white to-[#f8fafc] p-6 shadow-sm hover:shadow-md transition">
          <h2 className="mb-4 text-lg font-semibold text-[#112b3c]">
            Coordenação
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-gray-400">Coordenador</p>
              <p className="font-medium text-[#205375]">
                Hudson Costa Gonçalves da Cruz
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Coordenador Adjunto</p>
              <p className="font-medium text-[#205375]">
                José Alex Pontes Martins
              </p>
            </div>
          </div>
        </div>

        {/* FUNCIONAMENTO */}
        <div className="rounded-2xl border bg-gradient-to-br from-white to-[#f8fafc] p-6 shadow-sm hover:shadow-md transition">
          <h2 className="mb-4 text-lg font-semibold text-[#112b3c]">
            Funcionamento
          </h2>

          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <span className="font-medium text-[#205375]">Turnos:</span> Manhã,
              Tarde e Noite
            </p>

            <p>
              <span className="font-medium text-[#205375]">Local:</span> Campus
              da CIDAO
            </p>

            <p className="text-gray-500 text-xs leading-relaxed">
              Av. Dr. Guarany, 535 – Jocely Dantas
              <br />
              Sobral – CE, 62042-030
            </p>
          </div>
        </div>
      </div>

      {/* CONTATO */}
      <div className="rounded-2xl border bg-[#205375]/5 p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#112b3c]">Contato</h2>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <FiMail />
              computacao_coordenacao@uvanet.br
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <FiPhone />
              (88) 3677-4222
            </div>
          </div>

          <button
            onClick={handleCopyEmail}
            className="rounded-md bg-[#205375] px-4 py-2 text-sm font-medium text-white transition hover:scale-105 hover:shadow-md"
          >
            {copied ? "Email copiado ✅" : "Copiar email"}
          </button>
        </div>
      </div>

      {/* PROFESSORES */}

      <div className="rounded-2xl border p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-[#112b3c]">
          Professores
        </h2>

        <ul className="divide-y">
          {professors.map((prof, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-4 text-sm"
            >
              {/* NOME */}
              <div className="flex flex-col">
                <span className="font-medium text-[#205375]">{prof.name}</span>

                <span className="text-gray-500 text-xs">Professor(a)</span>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMail size={14} />
                  <span className="hidden sm:block">{prof.email}</span>
                </div>

                <button
                  onClick={() => handleCopy(prof.email)}
                  className="text-[#205375] hover:scale-110 transition"
                >
                  {copied === prof.email ? <FiCheck /> : <FiCopy />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* CENTRO ACADÊMICO */}
      <div className="rounded-2xl border p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#112b3c]">
          Centro Acadêmico
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed">
          O Centro Acadêmico representa os estudantes, organiza eventos e atua
          como ponte entre alunos e coordenação.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {["Presidente", "Vice-presidente", "Tesoureiro", "Secretário"].map(
            (role, i) => (
              <div
                key={i}
                className="rounded-lg border p-4 text-sm text-center hover:bg-[#205375]/5 transition"
              >
                <p className="font-medium text-[#205375]">{role}</p>
                <p className="text-xs text-gray-400">Nome do integrante</p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
