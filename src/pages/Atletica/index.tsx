import {
  FiInstagram,
  FiMail,
  FiUsers,
  FiAward,

} from "react-icons/fi";

import { BsController } from "react-icons/bs";
import { SectionHeader } from "../../components/SectionHeader";

export default function Atletica() {
  return (
    <section className="mx-auto pt-24 sm:pt-32 pb-16 w-full max-w-7xl space-y-12 px-4 sm:px-6">
      {/* HEADER + CTA */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between transition-all duration-500">
        <SectionHeader
          title="A.A.A. Cybernética"
          description="Associação Atlética Acadêmica de Ciências da Computação – UVA"
        />
      </div>

      {/* IDENTITY CARD */}
      <div className="rounded-2xl border dark:border-gray-800 bg-linear-to-br from-white to-[#f8fafc] dark:from-slate-900/50 dark:to-slate-950/50 p-6 shadow-sm transition-all duration-500">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* Phoenix emblem placeholder */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#205375]/10 dark:bg-sky-400/10 text-2xl transition-colors duration-500">
                🔥
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#112b3c] dark:text-white transition-colors duration-500">
                  A Fênix Renasceu
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uma nova era para o esporte do curso
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Somos a Associação Atlética Acadêmica de Ciências da Computação da
              Universidade Estadual Vale do Acaraú (UVA). Representamos o curso
              com excelência, unindo alunos em torno do espírito esportivo e da
              paixão pela tecnologia.
            </p>

            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Com o renascimento da Fênix, estamos construindo uma nova
              identidade esportiva para o nosso curso — competindo e
              conquistando nas mais diversas modalidades universitárias.
            </p>
          </div>

          {/* Right: info grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Tipo",
                value: "Sem fins lucrativos",
                icon: <FiAward size={16} />,
              },
              {
                label: "Seguidores",
                value: "985+",
                icon: <FiUsers size={16} />,
              },
              {
                label: "Modalidades",
                value: "5 esportes",
                icon: <BsController size={16} />,
              },
              { label: "Universidade", value: "UVA – CE", icon: null },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border dark:border-gray-800 bg-white dark:bg-slate-900/50 p-4 shadow-sm transition-all duration-500"
              >
                <div className="mb-1 flex items-center gap-1.5 text-[#205375] dark:text-sky-400 transition-colors duration-500">
                  {item.icon}
                  <p className="text-xs text-gray-400 dark:text-gray-500">{item.label}</p>
                </div>
                <p className="font-semibold text-[#205375] dark:text-blue-300 text-sm">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border dark:border-gray-800 bg-white dark:bg-slate-950/40 p-6 shadow-sm sm:flex-row sm:items-center transition-all duration-500">
        <div>
          <h2 className="text-lg font-semibold text-[#112b3c] dark:text-white transition-colors duration-500">
            Contato
          </h2>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-500">
            <FiMail size={14} />
            aaacybernetica@gmail.com
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:aaacybernetica@gmail.com"
            className="rounded-md border border-[#205375] dark:border-sky-500 px-4 py-2 text-sm font-medium text-[#205375] dark:text-sky-400 transition-all duration-300 hover:bg-[#205375]/5 dark:hover:bg-sky-500/10"
          >
            Enviar e-mail
          </a>
          <a
            href="https://www.instagram.com/aaacybernetica/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md bg-[#205375] dark:bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:opacity-90 active:scale-95"
          >
            <FiInstagram size={14} />
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
