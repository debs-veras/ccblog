import useToastLoading from "./useToastLoading";
import type { User } from "../types/user";

export function useStorage() {
  const toast = useToastLoading();

  const handleError = (msg: string, error: unknown) => {
    console.error(msg, error);
    toast({
      mensagem: msg,
      tipo: "error",
    });
  };

  return {
    getSession: () => {
      try {
        return localStorage.getItem("token");
      } catch (error) {
        handleError("Erro ao obter sessão", error);
        return null;
      }
    },

    setSession: (token: string) => {
      try {
        if (token && token !== "undefined" && token !== "null")
          localStorage.setItem("token", token);
      } catch (error) {
        handleError("Erro ao iniciar sessão", error);
      }
    },

    removeSession: () => {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (error) {
        handleError("Erro ao encerrar sessão", error);
      }
    },

    getUser: (): User | null => {
      try {
        const user = localStorage.getItem("user");
        if (!user || user === "undefined" || user === "null") return null;
        return JSON.parse(user);
      } catch (error) {
        handleError("Erro ao carregar usuário", error);
        return null;
      }
    },

    setUser: (user: User) => {
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        handleError("Erro ao salvar usuário", error);
      }
    },
  };
}
