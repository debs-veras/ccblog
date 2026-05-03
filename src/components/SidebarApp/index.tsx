import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  Sun,
  Moon,
  Tag,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Code2,
  X,
} from "lucide-react";
import Notifications from "@/components/Notifications";
import useUserStore from "@/stores/useUserStore";
import { useTheme } from "@/contexts/ThemeContext";
import type { MenuItem } from "@/types/menuItem";
import { logout } from "@/services/auth.service";
import useToastLoading from "@/hooks/useToastLoading";
import { getRoleLabel } from "@/utils/roles";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SidebarApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToastLoading();
  const { theme, toggleTheme } = useTheme();
  const user = useUserStore((s) => s.user);
  const userRole = user?.role || "AUTHOR";
  const { isMobile, setOpenMobile } = useSidebar();

  const menuItems: MenuItem[] = [
    {
      icon: <Home className="size-5" />,
      label: "Dashboard",
      path: "/dashboard/aluno",
      roles: ["STUDENT"],
    },
    {
      icon: <Home className="size-5" />,
      label: "Dashboard",
      path: "/dashboard/professor",
      roles: ["TEACHER"],
    },
    {
      icon: <BookOpen className="size-5" />,
      label: "Disciplinas",
      path: "/disciplinas",
      roles: ["ADMIN"],
      subItems: [
        {
          label: "Todas as Disciplinas",
          path: "/disciplinas",
          roles: ["ADMIN"],
        },
        {
          label: "Nova Disciplina",
          path: "/disciplina/form",
          roles: ["ADMIN"],
        },
      ],
    },
    {
      icon: <FileText className="size-5" />,
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
      icon: <Tag className="size-5" />,
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
      icon: <Users className="size-5" />,
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
      icon: <CheckCircle2 className="size-5" />,
      label: "Matrícula",
      path: "/matricula",
      roles: ["STUDENT"],
    },
    {
      icon: <Sparkles className="size-5" />,
      label: "Assistente IA",
      path: "/assistente",
      roles: ["STUDENT"],
    },
    {
      icon: <Settings className="size-5" />,
      label: "Configurações",
      path: "/configuracoes",
      roles: ["STUDENT", "TEACHER"],
    },
  ];

  const filteredMenuItems = menuItems
    .filter((item) => !item.roles || item.roles.includes(userRole))
    .map((item) => ({
      ...item,
      subItems: item.subItems?.filter(
        (subItem) => !subItem.roles || subItem.roles.includes(userRole),
      ),
    }));

  const handleLogout = async () => {
    toast({ mensagem: "Saindo do sistema..." });
    const response = await logout();
    toast({ tipo: "dismiss" });
    if (response.success) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      useUserStore.getState().logout();
      navigate("/login");
    }
    toast({
      mensagem: response.message,
      tipo: response.type,
    });
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0 shadow-2xl">
      <SidebarHeader className="py-6 px-0 group-data-[collapsible=icon]:items-center relative">
        <div className="flex items-center gap-3 px-4 w-full">
          <div className="size-10 bg-linear-to-br from-[#ff7a00] to-[#ff9d42] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
            <Code2 className="size-6 text-white" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden animate-in fade-in slide-in-from-left-4 duration-300">
            <span className="text-xl font-black tracking-tight leading-none text-[#112b3c] dark:text-white">
              CC<span className="text-[#ff7a00]">Blog</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#b4b3b2] mt-0.5">
              Academy Portal
            </span>
          </div>
          <div className="ml-auto group-data-[collapsible=icon]:hidden flex items-center gap-1 pt-1">
            {user?.role === "STUDENT" && <Notifications />}
            {isMobile && (
              <button
                onClick={() => setOpenMobile(false)}
                className="size-10 flex items-center justify-center rounded-xl hover:bg-orange-500/10 hover:text-orange-500 transition-all duration-300 border border-transparent hover:border-orange-500/20"
                aria-label="Fechar menu"
              >
                <X className="size-6" />
              </button>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0">
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
    
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
              {filteredMenuItems.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isActive =
                  location.pathname === item.path ||
                  (hasSubItems &&
                    item.subItems!.some(
                      (sub) => location.pathname === sub.path,
                    ));

                if (hasSubItems) {
                  return (
                    <Collapsible
                      key={item.label}
                      asChild
                      defaultOpen={isActive}
                      className="group/collapsible w-full"
                    >
                      <SidebarMenuItem className="group-data-[collapsible=icon]:w-auto">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.label}
                            isActive={isActive}
                            className="h-11 px-4 hover:bg-orange-500/5 data-[active=true]:bg-orange-500/10 data-[active=true]:text-[#ff7a00] group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                          >
                            <span
                              className={
                                isActive
                                  ? "text-[#ff7a00]"
                                  : "text-muted-foreground group-hover/menu-button:text-[#ff7a00] transition-colors"
                              }
                            >
                              {item.icon}
                            </span>
                            <span className="font-semibold group-data-[collapsible=icon]:hidden">
                              {item.label}
                            </span>
                            <ChevronDown className="ml-auto size-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="animate-in fade-in slide-in-from-top-2 duration-200 group-data-[collapsible=icon]:hidden">
                          <SidebarMenuSub className="ml-4 border-l-2 border-orange-500/20 py-1 gap-1">
                            {item.subItems!.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.path}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={location.pathname === subItem.path}
                                  className="h-9 px-4 data-[active=true]:text-[#ff7a00] data-[active=true]:bg-transparent font-medium"
                                >
                                  <NavLink to={subItem.path}>
                                    {subItem.label}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem
                    key={item.label}
                    className="group-data-[collapsible=icon]:w-auto"
                  >
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={isActive}
                      className="h-11 px-4 hover:bg-orange-500/5 data-[active=true]:bg-orange-500/10 data-[active=true]:text-[#ff7a00] group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
                    >
                      <NavLink to={item.path}>
                        <span
                          className={
                            isActive
                              ? "text-[#ff7a00]"
                              : "text-muted-foreground group-hover/menu-button:text-[#ff7a00] transition-colors"
                          }
                        >
                          {item.icon}
                        </span>
                        <span className="font-semibold group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar/50 backdrop-blur-sm group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <SidebarMenu className="gap-2 group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:w-auto">
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip="Alternar tema"
              className="h-10 hover:bg-muted/50 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
            >
              {theme === "light" ? (
                <Moon className="size-5 text-slate-600" />
              ) : (
                <Sun className="size-5 text-amber-400" />
              )}
              <span className="font-medium group-data-[collapsible=icon]:hidden">
                Modo {theme === "light" ? "Noturno" : "Diurno"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {user && (
            <SidebarMenuItem className="group-data-[collapsible=icon]:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="h-14 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 data-[state=open]:bg-muted/50 transition-all group-data-[collapsible=icon]:size-12 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-lg"
                  >
                    <div className="flex aspect-square size-10 group-data-[collapsible=icon]:size-9 items-center justify-center rounded-lg bg-linear-to-br from-[#ff7a00] to-[#ff9d42] text-white font-bold shadow-md shadow-orange-500/20 shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-2">
                      <span className="truncate font-bold text-[#112b3c] dark:text-white">
                        {user.name}
                      </span>
                      <span className="truncate text-[12px] font-bold text-orange-500/80 tracking-tighter">
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-xl p-2 shadow-2xl border-border/50"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="p-2 font-normal">
                    <div className="flex items-center gap-3 px-1 py-2">
                      <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-linear-to-br from-[#ff7a00] to-[#ff9d42] text-white font-bold shadow-lg shadow-orange-500/20">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-bold text-[#112b3c] dark:text-white text-base">
                          {user.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground font-medium">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Infomação da Conta
                  </div>
                  <DropdownMenuItem className="flex items-center gap-2 px-3 py-2.5 rounded-lg focus:bg-orange-500/5 focus:text-[#ff7a00] transition-colors cursor-default">
                    <Users className="size-4" />
                    <span className="font-semibold">
                      {getRoleLabel(user.role)}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-500 focus:bg-red-500/5 focus:text-red-600 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    <span className="font-bold">Encerrar Sessão</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
