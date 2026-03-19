import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  HiHome,
  HiDocumentText,
  HiUsers,
  HiCog,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown,
  HiLogout,
  HiSun,
  HiMoon,
  HiChip,
  HiTag,
  HiBookOpen,
} from "react-icons/hi";
import { useStorage } from "../../hooks/storage";
import { useTheme } from "../../contexts/ThemeContext";
import type { MenuItem } from "../../types/menuItem";
import ScrollArea from "../UI/ScrollArea";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem("menuOpen");
    return saved === null ? true : saved === "true";
  });
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const storage = useStorage();
  const user = storage.getUser();
  const userRole = user?.role || "AUTHOR";

  const menuItems: MenuItem[] = [
    {
      icon: <HiHome className="w-6 h-6" />,
      label: "Dashboard",
      path: "/dashboard",
      roles: ["ADMIN", "AUTHOR"],
    },
    {
      icon: <HiBookOpen className="w-6 h-6" />,
      label: "Disciplinas",
      path: "/disciplina",
      roles: ["ADMIN"],
    },
    {
      icon: <HiDocumentText className="w-6 h-6" />,
      label: "Posts",
      path: "/posts",
      roles: ["ADMIN", "STUDENT", "TEACHER"],
      subItems: [
        {
          label: "Todos os Posts",
          path: "/posts",
          roles: ["ADMIN"],
        },
        {
          label: "Novo Post",
          path: "/post/form",
          roles: ["ADMIN", "STUDENT", "TEACHER"],
        },
        {
          label: "Meus Posts",
          path: "/meus-posts",
          roles: ["ADMIN", "STUDENT", "TEACHER"],
        },
      ],
    },
    {
      icon: <HiTag className="w-6 h-6" />,
      label: "Categorias",
      path: "/categorias",
      roles: ["ADMIN"],
      subItems: [
        {
          label: "Nova Categoria",
          path: "/categoria/form",
          roles: ["ADMIN"],
        },
        {
          label: "Gerenciar Categorias",
          path: "/categorias",
          roles: ["ADMIN"],
        },
      ],
    },
    {
      icon: <HiUsers className="w-6 h-6" />,
      label: "Usuários",
      path: "/users",
      roles: ["ADMIN"],
      subItems: [
        {
          label: "Novo Usuário",
          path: "/user/form",
          roles: ["ADMIN"],
        },
        {
          label: "Gerenciar Usuários",
          path: "/users",
          roles: ["ADMIN"],
        },
      ],
    },
    {
      icon: <HiCog className="w-6 h-6" />,
      label: "Configurações",
      path: "/configuracoes",
      roles: ["ADMIN", "AUTHOR"],
    },
  ];

  // Filtra os menus baseado no role do usuário
  const filteredMenuItems = menuItems
    .filter((item) => !item.roles || item.roles.includes(userRole))
    .map((item) => ({
      ...item,
      subItems: item.subItems?.filter(
        (subItem) => !subItem.roles || subItem.roles.includes(userRole),
      ),
    }));

  const handleLogout = () => {
    storage.removeSession();
    navigate("/login");
  };

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isSubmenuActive = (subItems: Array<{ path: string }>) => {
    return subItems.some((item) => location.pathname.startsWith(item.path));
  };

  useEffect(() => {
    localStorage.setItem("menuOpen", String(menuOpen));
  }, [menuOpen]);

  return (
    <aside
      className={`h-screen flex flex-col transition-all duration-300 shadow-lg border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${
        menuOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center transition-all duration-300 mt-5 px-4 py-2 shrink-0 ${
          menuOpen ? "justify-between" : "justify-center flex-col gap-3"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
            <HiChip className="w-6 h-6 text-white" />
          </div>
          {menuOpen && (
            <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              TechNews
            </span>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
        >
          {menuOpen ? (
            <HiChevronLeft className="w-5 h-5 text-blue-400" />
          ) : (
            <HiChevronRight className="w-5 h-5 text-blue-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 min-h-0" paddingX="">
        <nav className="px-3 py-4 space-y-1">
          {filteredMenuItems.map((item, index) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isActive =
              location.pathname === item.path ||
              (hasSubItems && isSubmenuActive(item.subItems!));
            const isSubmenuOpen = openSubmenus[item.label];

            return (
              <div key={index}>
                {hasSubItems ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={`group relative flex items-center transition-all duration-200 rounded-lg w-full px-3 py-2.5 gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        isActive
                          ? "bg-blue-500/10 border-l-4 border-blue-500"
                          : ""
                      }`}
                      title={!menuOpen ? item.label : undefined}
                    >
                      <div
                        className={`shrink-0 transition-colors ${
                          isActive
                            ? "text-blue-400"
                            : "text-gray-400 group-hover:text-blue-400"
                        }`}
                      >
                        {item.icon}
                      </div>

                      {menuOpen && (
                        <>
                          <span className="font-medium text-sm text-gray-700 dark:text-gray-200 flex-1 text-left">
                            {item.label}
                          </span>
                          <HiChevronDown
                            className={`w-5 h-5 transition-transform duration-200 text-gray-400 ${
                              isSubmenuOpen ? "rotate-180" : ""
                            }`}
                          />
                        </>
                      )}
                    </button>

                    {menuOpen && isSubmenuOpen && (
                      <div className="ml-9 mt-1 space-y-1">
                        {item.subItems!.map((subItem, subIndex) => (
                          <NavLink
                            key={subIndex}
                            to={subItem.path}
                            className={({ isActive }) =>
                              `block px-3 py-2 rounded-lg text-sm transition-colors ${
                                isActive
                                  ? "text-blue-400 bg-blue-500/10"
                                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2.5 gap-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        isActive
                          ? "bg-blue-500/10 border-l-4 border-blue-500"
                          : ""
                      }`
                    }
                    title={!menuOpen ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`shrink-0 transition-colors ${
                            isActive
                              ? "text-blue-400"
                              : "text-gray-600 dark:text-gray-400 group-hover:text-blue-400"
                          }`}
                        >
                          {item.icon}
                        </div>
                        {menuOpen && (
                          <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
                            {item.label}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-3 space-y-2">
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full ${
            !menuOpen ? "justify-center" : ""
          }`}
          title={!menuOpen ? "Alternar tema" : undefined}
        >
          {theme === "light" ? (
            <HiMoon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <HiSun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
          {menuOpen && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Tema
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-gray-600 dark:text-gray-400 ${
            !menuOpen ? "justify-center" : ""
          }`}
          title={!menuOpen ? "Sair" : undefined}
        >
          <HiLogout className="w-5 h-5" />
          {menuOpen && <span className="text-sm">Sair</span>}
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div
          className={`flex items-center gap-3 px-3 py-3 bg-gray-100 dark:bg-gray-800 ${
            !menuOpen ? "justify-center" : ""
          }`}
        >
          {/* Avatar fake com inicial */}
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          {menuOpen && (
            <div className="flex flex-col text-sm">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {user.name}
              </span>
              <span className="text-xs text-gray-500">{user.email}</span>
              <span className="text-xs text-blue-400 font-semibold">
                {userRole}
              </span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
