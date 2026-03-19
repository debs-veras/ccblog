import { useNavigate } from "react-router-dom";
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

      storage.setSession(token);
      storage.setUser(user as User);
      navigate("/dashboard");
    }

    toast({ mensagem: response.message, tipo: response.type });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4 transition-colors">
      {/* TOGGLE THEME */}
      <div className="absolute top-0 right-0 p-4">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {theme === "light" ? (
            <HiMoon className="w-5 h-5" />
          ) : (
            <HiSun className="w-5 h-5 text-yellow-400" />
          )}
        </button>
      </div>

      {/* CARD */}
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8 border border-gray-200 dark:border-gray-800">
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#205375]/10">
              <HiAcademicCap className="h-7 w-7 text-[#205375]" />
            </div>

            <h1 className="text-xl font-semibold text-[#112b3c] dark:text-white">
              Portal Acadêmico
            </h1>

            <p className="text-sm text-gray-500">Ciência da Computação - UVA</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">
                Email
              </label>

              <div className="relative mt-1">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  {...register("email")}
                  placeholder="seuemail@uvanet.br"
                  className={`w-full rounded-lg border px-10 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-[#205375]"
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
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border px-10 pr-10 py-3 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-[#205375]"
                  }`}
                />

                {/* TOGGLE SENHA */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#205375] transition"
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
              className="w-full rounded-lg bg-[#205375] py-3 text-white font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
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
