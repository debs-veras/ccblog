import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HiMail, HiLockClosed, HiAcademicCap, HiLogin, HiSun, HiMoon, HiEye, HiEyeOff, HiArrowLeft } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useState, useEffect } from "react";
import { loginSchema } from "@/schemas/auth";
import useToastLoading from "@/hooks/useToastLoading";
import { useTheme } from "@/contexts/ThemeContext";
import useUserStore from "@/stores/useUserStore";
import { login, loginWithGoogle } from "@/services/auth.service";
import type { User } from "@/types/user";

declare global {
  interface Window {
    google?: any;
  }
}

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const { theme, toggleTheme } = useTheme();
  const user = useUserStore((s) => s.user);
  const token = useUserStore((s) => s.token);
  const setUser = useUserStore((s) => s.setUser);
  const setToken = useUserStore((s) => s.setToken);

  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Se o usuário já estiver logado, redireciona para dentro do sistema
  useEffect(() => {
    if (token && user) {
      let dashboardRoute = "/posts";
      if (user.role === "STUDENT") dashboardRoute = "/dashboard/aluno";
      else if (user.role === "TEACHER") dashboardRoute = "/dashboard/professor";
      else if (user.role === "ADMIN") dashboardRoute = "/users";
      navigate(dashboardRoute, { replace: true });
    }
  }, [token, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleGoogleSuccess = async (credential: string) => {
    try {
      setIsGoogleLoading(true);
      const response = await loginWithGoogle({ credential });

      if (response.success && response.data) {
        const { token, user } = response.data;
        if (!token || !user) {
          toast({ mensagem: "Erro ao processar login com o Google", tipo: "error"});
          return;
        }

        const typedUser = user as User;

        if (rememberMe) localStorage.setItem("ccblog_remember_me", "true");
        else localStorage.removeItem("ccblog_remember_me");
      
        sessionStorage.setItem("ccblog_session_active", "true");
        setToken(token);
        setUser(typedUser);

        let dashboardRoute = "/posts";
        if (typedUser.role === "STUDENT") dashboardRoute = "/dashboard/aluno";
        else if (typedUser.role === "TEACHER") dashboardRoute = "/dashboard/professor";
        else if (typedUser.role === "ADMIN") dashboardRoute = "/users";

        navigate(dashboardRoute);
      }

      toast({ mensagem: response.message, tipo: response.type });
    } catch (err: any) {
      toast({
        mensagem: err?.message || "Ocorreu um erro ao tentar entrar com o Google",
        tipo: "error",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!googleClientId) return;

    const renderGoogleBtn = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response: any) => {
            if (response.credential) {
              handleGoogleSuccess(response.credential);
            }
          },
        });

        const container = document.getElementById("googleBtnContainer");
        if (container) {
          container.innerHTML = "";
          const availableWidth = container.clientWidth || 300;
          const targetWidth = Math.min(Math.max(availableWidth, 200), 380).toString();

          window.google.accounts.id.renderButton(container, {
            theme: theme === "dark" ? "filled_black" : "outline",
            size: "large",
            width: targetWidth,
            text: "continue_with",
            locale: "pt-BR",
            shape: "rectangular",
          });
        }
      }
    };

    if (!document.getElementById("google-jssdk")) {
      const script = document.createElement("script");
      script.id = "google-jssdk";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleBtn;
      document.head.appendChild(script);
    } else {
      renderGoogleBtn();
    }

    const handleResize = () => {
      renderGoogleBtn();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [googleClientId, theme]);

  const onSubmit = async (data: LoginFormData) => {
    const response = await login(data);

    if (response.success && response.data) {
      const { token, user } = response.data;
      if (!token || !user) {
        toast({ mensagem: "Erro ao processar login", tipo: "error" });
        return;
      }

      const typedUser = user as User;
      if (rememberMe) localStorage.setItem("ccblog_remember_me", "true");
      else localStorage.removeItem("ccblog_remember_me");
      
      sessionStorage.setItem("ccblog_session_active", "true");

      setToken(token);
      setUser(typedUser);

      let dashboardRoute = "/posts";
      if (typedUser.role === "STUDENT") dashboardRoute = "/dashboard/aluno";
      else if (typedUser.role === "TEACHER") dashboardRoute = "/dashboard/professor";
      else if (typedUser.role === "ADMIN") dashboardRoute = "/users";

      navigate(dashboardRoute);
    }

    toast({ mensagem: response.message, tipo: response.type });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
      {/* BACK TO HOME */}
      <div className="absolute top-0 left-0 p-4 transition-all duration-500">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md border border-gray-200 dark:border-slate-800 px-3 py-2 bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <HiArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
      </div>

      {/* TOGGLE THEME */}
      <div className="absolute top-0 right-0 p-4 transition-all duration-500">
        <button
          onClick={toggleTheme}
          aria-label="Alternar tema"
          className="flex items-center justify-center rounded-md border border-gray-200 dark:border-slate-800 p-2 bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300"
        >
          {theme === "light" ? (
            <HiMoon className="w-5 h-5" />
          ) : (
            <HiSun className="w-5 h-5 text-yellow-400" />
          )}
        </button>
      </div>

      {/* CARD */}
      <div className="w-full max-w-md transition-all duration-500">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-5 sm:p-8 border border-gray-200 dark:border-slate-800 transition-all duration-500">
          {/* HEADER */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#205375]/10 dark:bg-sky-500/10 transition-colors duration-500">
              <HiAcademicCap className="h-7 w-7 text-[#205375] dark:text-sky-400" />
            </div>

            <h1 className="text-xl font-semibold text-[#112b3c] dark:text-white transition-colors duration-500">
              Portal Acadêmico
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ciência da Computação - UVA
            </p>
          </div>

          {/* GOOGLE LOGIN FOR STUDENTS */}
          <div className="mb-6">
            <div className="text-center mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800/50">
                Área do Estudante
              </span>
            </div>

            {googleClientId ? (
              <div className="flex flex-col items-center justify-center gap-2 w-full">
                <div id="googleBtnContainer" className="min-h-[44px] w-full flex justify-center overflow-hidden" />
                {isGoogleLoading && (
                  <div className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400">
                    <FaSpinner className="animate-spin" /> Autenticando com o Google...
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  toast({
                    mensagem:
                      "Para habilitar o login com o Google, configure VITE_GOOGLE_CLIENT_ID nas variáveis de ambiente.",
                    tipo: "info",
                  })
                }
                className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm"
              >
                <FcGoogle className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Entrar com o Google (Estudante)</span>
              </button>
            )}

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-gray-400 dark:text-gray-500 font-normal">
                  ou acesse com e-mail
                </span>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Email
              </label>

              <div className="relative mt-1">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                <input
                  type="email"
                  {...register("email")}
                  placeholder="seuemail@uvanet.br"
                  className={`w-full rounded-lg border px-10 py-3 text-sm bg-white dark:bg-slate-800 transition-all duration-300 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-slate-700 focus:ring-[#205375] dark:focus:ring-sky-500 dark:text-white"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* SENHA */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Senha
              </label>

              <div className="relative mt-1">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border px-10 pr-10 py-3 text-sm bg-white dark:bg-slate-800 transition-all duration-300 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-slate-700 focus:ring-[#205375] dark:focus:ring-sky-500 dark:text-white"
                  }`}
                />

                {/* TOGGLE SENHA */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#205375] dark:hover:text-sky-400 transition-colors duration-300"
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* PERMANECER CONECTADO */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#205375] dark:text-sky-500 focus:ring-[#205375] dark:focus:ring-sky-500 border-gray-300 dark:border-slate-700 cursor-pointer"
                />
                <span>Permanecer conectado</span>
              </label>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#205375] dark:bg-sky-600 py-3 text-white font-bold hover:opacity-90 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#205375]/20 dark:shadow-sky-500/20"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <HiLogin />
                  Acessar sistema
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <p className="mt-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} UVA - Ciência da Computação
          </p>
        </div>
      </div>
    </div>
  );
}
