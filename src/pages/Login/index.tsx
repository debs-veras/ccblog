import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  HiMail,
  HiLockClosed,
  HiAcademicCap,
  HiLogin,
  HiSun,
  HiMoon,
  HiEye,
  HiEyeOff,
  HiArrowLeft,
} from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import { useState } from "react";
import { login as loginService } from "../../services/auth.service";
import useToastLoading from "../../hooks/useToastLoading";
import { useTheme } from "../../contexts/ThemeContext";
import { useStorage } from "../../hooks/storage";
import type { User } from "../../types/user";
import { loginSchema } from "../../schemas/auth";

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const { theme, toggleTheme } = useTheme();
  const storage = useStorage();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const response = await loginService(data);

    if (response.success && response.data) {
      const { token, user } = response.data;

      if (!token || !user) {
        toast({
          mensagem: "Erro ao processar login",
          tipo: "error",
        });
        return;
      }

      const typedUser = user as User;
      storage.setSession(token);
      storage.setUser(typedUser);
      
      let dashboardRoute = "/posts";
      if (typedUser.role === "STUDENT") dashboardRoute = "/dashboard/aluno";
      else if (typedUser.role === "TEACHER") dashboardRoute = "/dashboard/professor";
      else if (typedUser.role === "ADMIN") dashboardRoute = "/users";
      
      navigate(dashboardRoute);
    }

    toast({ mensagem: response.message, tipo: response.type });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4 transition-colors duration-500">
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-8 border border-gray-200 dark:border-slate-800 transition-all duration-500">
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#205375]/10 dark:bg-sky-500/10 transition-colors duration-500">
              <HiAcademicCap className="h-7 w-7 text-[#205375] dark:text-sky-400" />
            </div>

            <h1 className="text-xl font-semibold text-[#112b3c] dark:text-white transition-colors duration-500">
              Portal Acadêmico
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">Ciência da Computação - UVA</p>
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
