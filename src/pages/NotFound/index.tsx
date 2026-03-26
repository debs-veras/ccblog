import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <h1 className="text-9xl font-black text-slate-200 dark:text-slate-800 select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <FiAlertCircle className="text-6xl text-(--color-secondary) animate-pulse" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-8 space-y-4"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Página não encontrada
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Ops! Parece que você se perdeu pelo caminho. A página que você está procurando não existe ou foi movida.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-(--color-secondary) text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] hover:scale-105 transition-all duration-300 active:scale-95"
        >
          <FiHome size={20} />
          Voltar para o Início
        </Link>
      </motion.div>

      {/* Sugestões de links rápidos opcional aqui */}
    </div>
  );
}
