import Button from "../UI/Button";
import OpportunityCard from "./OpportunityCard";

export default function Opportunities() {
  const opportunities = [
    {
      id: 1,
      tag: "Pesquisa",
      title: "Iniciação Científica em Inteligência Artificial",
      description:
        "Vaga para estudantes de Ciência da Computação a partir do 3º semestre. Projeto com foco em Visão Computacional e Aprendizado de Máquina.",
      date: "15 MAR 2024",
    },
    {
      id: 2,
      tag: "Grupo de Estudo",
      title: "Desenvolvimento Web Fullstack: React e Node.js",
      description:
        "Encontros semanais para discussão de tecnologias web modernas, criação de projetos colaborativos e networking profissional.",
      date: "10 MAR 2024",
    },
    {
      id: 3,
      tag: "Extensão",
      title: "Inclusão Digital para a Terceira Idade",
      description:
        "Projeto voluntário focado em ensinar o uso de smartphones e computadores para idosos da comunidade local. Vagas para monitores.",
      date: "05 MAR 2024",
    },
    {
      id: 4,
      tag: "Estágio",
      title: "Desenvolvedor Frontend Júnior",
      description:
        "Oportunidade de estágio na empresa TechSolutions para atuar no desenvolvimento de interfaces com React e Tailwind CSS.",
      date: "01 MAR 2024",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto mt-10 md:mt-0 mb-10 md:mb-16 ">
      <div className="flex justify-between items-center mb-6 md:mb-8 w-full">
        <h2 className="color-primary text-xl sm:text-2xl md:text-3xl font-bold">
          Bolsas e Grupos de Estudo
        </h2>
        <Button model="button" type="default">
          Ver todas
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
        {opportunities.map((opp) => (
          <OpportunityCard
            key={opp.id}
            tag={opp.tag}
            title={opp.title}
            description={opp.description}
            date={opp.date}
          />
        ))}
      </div>
    </section>
  );
}
