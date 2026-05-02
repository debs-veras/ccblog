import { FaHome, FaTag } from "react-icons/fa";
import { useLocation, useParams, Link } from "react-router-dom";
import { type JSX, Fragment } from "react";
import {
  HiBookOpen,
  HiCheck,
  HiCog,
  HiDocumentText,
  HiSparkles,
  HiUser,
} from "react-icons/hi";
import useUserStore from "@/stores/useUserStore";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemType {
  name: string;
  path: string;
  icon: JSX.Element;
  active: boolean;
}

export default function BreadcrumbApp() {
  const location = useLocation();
  const { id } = useParams();
  const user = useUserStore((s) => s.user);

  let dashboardRoute = "/posts";
  if (user?.role === "STUDENT") dashboardRoute = "/dashboard/aluno";
  else if (user?.role === "TEACHER") dashboardRoute = "/dashboard/professor";
  else if (user?.role === "ADMIN") dashboardRoute = "/users";

  function resolveBreadcrumbs(): BreadcrumbItemType[] {
    const path = location.pathname;

    if (path === "/disciplinas") {
      return [
        {
          name: "Disciplinas",
          path: "/disciplinas",
          icon: <HiBookOpen className="h-5 w-5" />,
          active: true,
        },
      ];
    }

    if (path.startsWith("/disciplina/form")) {
      return [
        {
          name: "Disciplinas",
          path: "/disciplinas",
          icon: <HiBookOpen className="h-5 w-5" />,
          active: false,
        },
        {
          name: id ? "Editar Disciplina" : "Cadastrar Disciplina",
          path: "",
          icon: <HiBookOpen className="h-5 w-5" />,
          active: true,
        },
      ];
    }

    if (path === "/matricula") {
      return [
        {
          name: "Dashboard",
          path: dashboardRoute,
          icon: <FaHome className="h-5 w-5" />,
          active: false,
        },
        {
          name: "Matrícula",
          path: "/matricula",
          icon: <HiCheck className="h-5 w-5" />,
          active: true,
        },
      ];
    }

    if (path === "/assistente") {
      return [
        {
          name: "Dashboard",
          path: dashboardRoute,
          icon: <FaHome className="h-5 w-5" />,
          active: false,
        },
        {
          name: "Assistente",
          path: "/assistente",
          icon: <HiSparkles className="h-5 w-5" />,
          active: true,
        },
      ];
    }

    if (path === "/categorias") {
      return [
        {
          name: "Categorias",
          path: "/categorias",
          icon: <FaTag className="h-5 w-5" />,
          active: true,
        },
      ];
    }

    if (path.startsWith("/categoria/form")) {
      return [
        {
          name: "Categorias",
          path: "/categorias",
          icon: <HiDocumentText className="h-5 w-5" />,
          active: false,
        },
        {
          name: id ? "Editar Categoria" : "Cadastrar Categoria",
          path: "",
          icon: <HiDocumentText className="h-5 w-5" />,
          active: true,
        },
      ];
    }

    if (path === "/configuracoes") {
      return [
        {
          name: "Dashboard",
          path: dashboardRoute,
          icon: <FaHome className="h-5 w-5" />,
          active: false,
        },
        {
          name: "Configurações",
          path: "/configuracoes",
          icon: <HiCog className="h-5 w-5" />,
          active: true,
        },
      ];
    }

    if (path === "/users") {
      return [
        {
          name: "Usuários",
          path: "/users",
          icon: <FaTag className="h-5 w-5" />,
          active: true,
        },
      ];
    }

    if (path.startsWith("/user/form")) {
      return [
        {
          name: "Usuários",
          path: "/users",
          icon: <HiUser className="h-5 w-5" />,
          active: false,
        },
        {
          name: id ? "Editar Usuário" : "Cadastrar Usuário",
          path: "",
          icon: <HiUser className="h-5 w-5" />,
          active: true,
        },
      ];
    }

    if (path === "/meus-posts") {
      return [
        {
          name: "Dashboard",
          path: dashboardRoute,
          icon: <FaHome className="h-5 w-5" />,
          active: false,
        },
        {
          name: "Posts",
          path: "/meus-posts",
          icon: <HiDocumentText className="h-5 w-5" />,
          active: true,
        },
      ];
    }

    if (path === "/posts") {
      return [
        {
          name: "Posts",
          path: "/posts",
          icon: <HiDocumentText className="h-5 w-5" />,
          active: true,
        },
      ];
    }

    if (path.startsWith("/post/form")) {
      return [
        {
          name: "Dashboard",
          path: dashboardRoute,
          icon: <FaHome className="h-5 w-5" />,
          active: false,
        },
        {
          name: "Posts",
          path: "/meus-posts",
          icon: <HiDocumentText className="h-5 w-5" />,
          active: false,
        },
        {
          name: id ? "Editar Post" : "Cadastrar Post",
          path: "",
          icon: <HiDocumentText className="h-5 w-5" />,
          active: true,
        },
      ];
    }

    return [
      {
        name: "Dashboard",
        path: dashboardRoute,
        icon: <FaHome className="h-5 w-5" />,
        active: true,
      },
    ];
  }

  const breadcrumbs = resolveBreadcrumbs();

  return (
    <Breadcrumb className="px-1 md:px-0 py-2">
      <BreadcrumbList className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <Fragment key={`${item.path}-${index}`}>
            <BreadcrumbItem className="flex items-center">
              {item.active ? (
                <BreadcrumbPage className="flex items-center gap-1.5 text-gray-900 dark:text-white font-semibold cursor-default">
                  {item.icon}
                  {item.name}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    to={item.path}
                    className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-(--color-secondary) transition-colors duration-200 cursor-pointer"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator className="mx-1 text-gray-400 dark:text-gray-600" />
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
