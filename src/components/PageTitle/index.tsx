import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaTags,
  FaList,
  FaPenFancy,
  FaBookOpen,
} from "react-icons/fa";
import { HiCog } from "react-icons/hi";

export type PageMeta = {
  name: string;
  description: string;
  icon: React.ReactNode;
};

type PageConfig = {
  match: RegExp;
  data?: PageMeta;
  build?: (id?: string) => PageMeta;
};

interface PageTitleProps {
  onChange?: (page: PageMeta) => void;
}

export default function PageTitle({ onChange }: PageTitleProps) {
  const location = useLocation();

  const config: PageConfig[] = useMemo(
    () => [
      {
        match: /^\/dashboard\/aluno\/?$/,
        data: {
          name: "Bem-vindo de volta",
          description: "Aqui está um resumo da sua jornada acadêmica",
          icon: <FaHome />,
        },
      },
      {
        match: /^\/dashboard\/professor\/?$/,
        data: {
          name: "Painel do Professor",
          description: "Acompanhe suas disciplinas, alunos e publicações",
          icon: <FaHome />,
        },
      },
      {
        match: /^\/disciplina\/form$/,
        data: {
          name: "Nova Disciplina",
          description: "Crie uma nova disciplina",
          icon: <FaBookOpen />,
        },
      },
      {
        match: /^\/disciplina\/(.+)$/,
        build: (id) => ({
          name: "Editar Disciplina",
          description: `Editando disciplina #${id ?? ""}`,
          icon: <FaBookOpen />,
        }),
      },
      {
        match: /^\/disciplinas$/,
        data: {
          name: "Disciplinas",
          description: "Gerencie as disciplinas",
          icon: <FaBookOpen />,
        },
      },
      {
        match: /^\/posts$/,
        data: {
          name: "Posts",
          description: "Gerencie os posts do blog",
          icon: <FaPenFancy />,
        },
      },
      {
        match: /^\/post\/form$/,
        data: {
          name: "Novo Post",
          description: "Crie um novo post para compartilhar com seus leitores",
          icon: <FaPenFancy />,
        },
      },
      {
        match: /^\/meus-posts$/,
        data: {
          name: "Meus Posts",
          description: "Gerencie seus posts do blog",
          icon: <FaPenFancy />,
        },
      },
      {
        match: /^\/post\/form\/(.+)$/,
        build: (id) => ({
          name: "Editar Post",
          description: `Editando post #${id ?? ""}`,
          icon: <FaPenFancy />,
        }),
      },
      {
        match: /^\/categorias$/,
        data: {
          name: "Categorias",
          description: "Gerencie as categorias do blog",
          icon: <FaTags />,
        },
      },
      {
        match: /^\/categoria\/form$/,
        data: {
          name: "Nova Categoria",
          description: "Crie uma nova categoria",
          icon: <FaTags />,
        },
      },
      {
        match: /^\/categoria\/form\/(.+)$/,
        build: (id) => ({
          name: "Editar Categoria",
          description: `Editando categoria #${id ?? ""}`,
          icon: <FaTags />,
        }),
      },
      {
        match: /^\/configuracoes$/,
        data: {
          name: "Configurações",
          description: "Gerencie as configurações do sistema",
          icon: <HiCog className="h-5 w-5" />,
        },
      },
      {
        match: /^\/users$/,
        data: {
          name: "Usuários",
          description: "Gerencie os usuários do sistema",
          icon: <FaUser />,
        },
      },
      {
        match: /^\/user\/form$/,
        data: {
          name: "Novo Usuário",
          description: "Crie um novo usuário",
          icon: <FaUser />,
        },
      },
      {
        match: /^\/user\/form\/(.+)$/,
        build: (id) => ({
          name: "Editar Usuário",
          description: `Editando usuário #${id ?? ""}`,
          icon: <FaUser />,
        }),
      },
      {
        match: /^\/matricula$/,
        data: {
          name: "Matrícula Online",
          description: "Selecione suas disciplinas para o próximo semestre",
          icon: <FaBookOpen />,
        },
      },
    ],
    [],
  );

  const currentPage: PageMeta = useMemo(() => {
    const path = location.pathname;

    for (const item of config) {
      const match = path.match(item.match);
      if (!match) continue;
      if (item.data) return item.data;
      if (item.build) return item.build(match[1]);
    }

    return {
      name: "Página",
      description: "Navegue pelo blog",
      icon: <FaList />,
    };
  }, [location.pathname, config]);

  useEffect(() => {
    document.title = `${currentPage.name}`;
    onChange?.(currentPage);
  }, [currentPage, onChange]);

  return (
    <div className="flex flex-col">
      <div className="text-xl flex gap-2 items-center">
        <span className="text-primary">{currentPage.icon}</span>
        <h1 className="font-semibold text-primary">{currentPage.name}</h1>
      </div>

      <p className="text-sm text-gray-500">{currentPage.description}</p>
    </div>
  );
}
