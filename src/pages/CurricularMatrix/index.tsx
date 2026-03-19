import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Disciplina = {
  nome: string;
  carga: number;
  prereq?: string[];
};

type Periodo = {
  titulo: string;
  disciplinas: Disciplina[];
};

const matriz: Periodo[] = [
  {
    titulo: "1º Semestre",
    disciplinas: [
      { nome: "Lógica de Programação", carga: 80 },
      { nome: "Matemática Básica", carga: 60 },
      { nome: "Introdução à Ciência da Computação", carga: 60 },
      { nome: "Cálculo I", carga: 80 },
      { nome: "Circuitos Digitais", carga: 60 },
    ],
  },
  {
    titulo: "2º Semestre",
    disciplinas: [
      { nome: "Arquitetura de Computadores", carga: 80, prereq: ["Circuitos Digitais"] },
      { nome: "Cálculo II", carga: 60, prereq: ["Cálculo I"] },
      { nome: "Álgebra Linear", carga: 60 },
      { nome: "Linguagem de Programação I", carga: 100, prereq: ["Lógica de Programação"] },
      { nome: "Laboratório de Programação", carga: 60 },
    ],
  },
  {
    titulo: "3º Semestre",
    disciplinas: [
      { nome: "Estruturas de Dados", carga: 80, prereq: ["Linguagem de Programação I"] },
      { nome: "Banco de Dados I", carga: 80, prereq: ["Estruturas de Dados"] },
      { nome: "POO", carga: 100, prereq: ["Estruturas de Dados"] },
      { nome: "Estatística", carga: 60 },
    ],
  },
  {
    titulo: "4º Semestre",
    disciplinas: [
      { nome: "Engenharia de Software", carga: 60, prereq: ["Estruturas de Dados"] },
      { nome: "Banco de Dados II", carga: 80, prereq: ["Banco de Dados I"] },
      { nome: "Computação Gráfica", carga: 60 },
      { nome: "Análise de Algoritmos", carga: 80 },
      { nome: "Optativa", carga: 60 },
    ],
  },
  {
    titulo: "5º Semestre",
    disciplinas: [
      { nome: "Análise e Projeto de Sistemas", carga: 60 },
      { nome: "Linguagens Formais", carga: 80 },
      { nome: "Redes de Computadores", carga: 80 },
      { nome: "Sistemas Operacionais", carga: 80 },
      { nome: "Optativa", carga: 60 },
    ],
  },
  {
    titulo: "6º Semestre",
    disciplinas: [
      { nome: "Compiladores", carga: 80 },
      { nome: "Computação e Sociedade", carga: 60 },
      { nome: "Inteligência Artificial", carga: 80 },
      { nome: "Sistemas Distribuídos", carga: 60 },
      { nome: "Optativa", carga: 60 },
    ],
  },
  {
    titulo: "7º Semestre",
    disciplinas: [
      { nome: "Lab de Software", carga: 60 },
      { nome: "TCC I", carga: 60 },
      { nome: "Administração de Sistemas", carga: 60 },
      { nome: "Optativa", carga: 60 },
    ],
  },
  {
    titulo: "8º Semestre",
    disciplinas: [
      { nome: "TCC II", carga: 60, prereq: ["TCC I"] },
      { nome: "Optativas", carga: 60 },
      { nome: "Atividades Complementares", carga: 100 },
    ],
  },
];

export default function MatrizCurricular() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const navigate = useNavigate();

  const cargas = [
    { label: "Obrigatórias", valor: 2700 },
    { label: "Optativas", valor: 420 },
    { label: "Atividades Complementares", valor: 100 },
  ];

  const total = 3200;

  return (
    <main className="flex flex-col items-center w-full px-6 py-10">
      <div className="max-w-7xl w-full space-y-16">

        {/* HERO */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-[#112b3c]">
            Matriz Curricular
          </h1>
          <p className="text-gray-500 mt-2">
            Estrutura completa com disciplinas, cargas e pré-requisitos
          </p>
        </section>

        {/* INFO */}
        <section className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Duração", value: "4 anos" },
            { title: "Carga Total", value: "3200h" },
            { title: "Modalidade", value: "Bacharelado" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow border">
              <p className="text-sm text-gray-500">{item.title}</p>
              <h3 className="text-xl font-bold text-[#205375]">
                {item.value}
              </h3>
            </div>
          ))}
        </section>

        {/* DISTRIBUIÇÃO */}
        <section>
          <h2 className="text-2xl font-bold text-[#112b3c] mb-4">
            Distribuição da Carga
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {cargas.map((c, i) => {
              const pct = (c.valor / total) * 100;

              return (
                <div key={i} className="bg-white p-6 rounded-xl shadow border">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">{c.label}</span>
                    <span className="font-bold">{c.valor}h</span>
                  </div>

                  <div className="w-full h-2 bg-gray-100 rounded">
                    <div
                      className="h-2 bg-[#205375]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    {pct.toFixed(1)}%
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* MATRIZ */}
        <section>
          <h2 className="text-2xl font-bold text-[#112b3c] mb-4">
            Estrutura por Semestre
          </h2>

          {matriz.map((p, i) => {
            const isOpen = openIndex === i;

            const cargaTotal = p.disciplinas.reduce(
              (acc, d) => acc + d.carga,
              0
            );

            return (
              <div
                key={i}
                className="mb-4 bg-white border rounded-xl shadow overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-5 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-[#205375]">
                      {p.titulo}
                    </p>
                    <span className="text-xs text-gray-400">
                      {cargaTotal}h no semestre
                    </span>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiChevronDown />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 space-y-3">
                        {p.disciplinas.map((d, idx) => {
                          const isAtividade =
                            d.nome === "Atividades Complementares";

                          return (
                            <div
                              key={idx}
                              className="p-4 bg-gray-50 rounded-lg border space-y-2"
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {d.nome}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {d.carga}h
                                </span>
                              </div>

                              {d.prereq && (
                                <p className="text-xs text-gray-400">
                                  Pré-requisitos: {d.prereq.join(", ")}
                                </p>
                              )}

                              {isAtividade && (
                                <button
                                  onClick={() =>
                                    navigate("/atividades-complementares")
                                  }
                                  className="text-xs font-semibold text-[#205375] hover:underline"
                                >
                                  Ver detalhes das atividades →
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}