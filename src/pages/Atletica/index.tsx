import { useState } from "react";
import {
  FiInstagram,
  FiMail,
  FiUsers,
  FiAward,
  FiChevronDown,
  FiExternalLink,
} from "react-icons/fi";
import {
  GiTennisBall,
  GiBasketballBall,
  GiVolleyballBall,
  GiSoccerBall,
} from "react-icons/gi";
import { BsController } from "react-icons/bs";
import { SectionHeader } from "../../components/SectionHeader";

const sports = [
  {
    id: "esports",
    name: "E-Sports",
    icon: <BsController size={22} />,
    color: "#3b82f6",
    bg: "bg-blue-50",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    description:
      "Competições de jogos eletrônicos representando o curso em campeonatos universitários.",
  },
  {
    id: "futsal",
    name: "Futsal",
    icon: <GiSoccerBall size={22} />,
    color: "#64748b",
    bg: "bg-slate-50",
    text: "text-slate-600",
    badge: "bg-slate-100 text-slate-700",
    description:
      "Time masculino e feminino que compete em torneios interuniversitários.",
  },
  {
    id: "volei",
    name: "Vôlei",
    icon: <GiVolleyballBall size={22} />,
    color: "#a855f7",
    bg: "bg-purple-50",
    text: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    description:
      "Equipe de vôlei com treinos regulares e participação em ligas universitárias.",
  },
  {
    id: "tenis",
    name: "Tênis de Mesa",
    icon: <GiTennisBall size={22} />,
    color: "#22c55e",
    bg: "bg-green-50",
    text: "text-green-600",
    badge: "bg-green-100 text-green-700",
    description:
      "Modalidade individual e em duplas, com atletas ranqueados no cenário universitário.",
  },
  {
    id: "basquete",
    name: "Basquete",
    icon: <GiBasketballBall size={22} />,
    color: "#f97316",
    bg: "bg-orange-50",
    text: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    description:
      "Times 5x5 e 3x3 treinando para competições regionais e nacionais.",
  },
];

export default function Atletica() {
  const [openSport, setOpenSport] = useState<string | null>(null);

  return (
    <section className="mx-auto my-12 w-full max-w-7xl space-y-12 px-4 sm:px-6">
      {/* HEADER + CTA */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          title="A.A.A. Cybernética"
          description="Associação Atlética Acadêmica de Ciências da Computação – UVA"
        />

        <a
          href="https://www.instagram.com/aaacybernetica/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md bg-[#205375] px-4 py-2 text-sm font-medium text-white transition hover:scale-105 hover:shadow-md"
        >
          <FiInstagram size={16} />
          Seguir no Instagram
          <FiExternalLink size={14} />
        </a>
      </div>

      {/* IDENTITY CARD */}
      <div className="rounded-2xl border dark:border-gray-800 bg-linear-to-br from-white to-[#f8fafc] dark:from-gray-900 dark:to-gray-800 p-6 shadow-sm">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {/* Phoenix emblem placeholder */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#205375]/10 text-2xl">
                🔥
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#112b3c] dark:text-white">
                  A Fênix Renasceu
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uma nova era para o esporte do curso
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Somos a Associação Atlética Acadêmica de Ciências da Computação
              da Universidade Estadual Vale do Acaraú (UVA). Representamos o
              curso com excelência, unindo alunos em torno do espírito esportivo
              e da paixão pela tecnologia.
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
              { label: "Tipo", value: "Sem fins lucrativos", icon: <FiAward size={16} /> },
              { label: "Seguidores", value: "985+", icon: <FiUsers size={16} /> },
              { label: "Modalidades", value: "5 esportes", icon: <BsController size={16} /> },
              { label: "Universidade", value: "UVA – CE", icon: null },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
              >
                <div className="mb-1 flex items-center gap-1.5 text-[#205375]">
                  {item.icon}
                  <p className="text-xs text-gray-400">{item.label}</p>
                </div>
                <p className="font-semibold text-[#205375] dark:text-blue-300 text-sm">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SPORTS */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-[#112b3c] dark:text-white">
          Modalidades Esportivas
        </h2>

        <div className="space-y-3">
          {sports.map((sport) => {
            const isOpen = openSport === sport.id;
            return (
              <div
                key={sport.id}
                className="rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden transition hover:shadow-md"
              >
                <button
                  onClick={() => setOpenSport(isOpen ? null : sport.id)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${sport.bg} ${sport.text}`}
                    >
                      {sport.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-[#205375] dark:text-blue-300">
                        {sport.name}
                      </p>
                      {!isOpen && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Clique para ver mais
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    className={`text-gray-400 transition-transform duration-250 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <FiChevronDown />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t dark:border-gray-700 px-5 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {sport.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CONTACT */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border dark:border-gray-800 p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#112b3c] dark:text-white">Contato</h2>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FiMail size={14} />
            aaacybernetica@gmail.com
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:aaacybernetica@gmail.com"
            className="rounded-md border border-[#205375] dark:border-blue-500 px-4 py-2 text-sm font-medium text-[#205375] dark:text-blue-400 transition hover:bg-[#205375]/5 dark:hover:bg-blue-500/10"
          >
            Enviar e-mail
          </a>
          <a
            href="https://www.instagram.com/aaacybernetica/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md bg-[#205375] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            <FiInstagram size={14} />
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
