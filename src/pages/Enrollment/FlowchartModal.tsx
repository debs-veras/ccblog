import { FiX, FiDownload, FiMaximize2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface FlowchartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FlowchartModal({ isOpen, onClose }: FlowchartModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shrink-0">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Fluxograma Curricular - Ciência da Computação
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Visualize a estrutura completa do curso ou faça o download em PDF.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/fluxograma-curso.pdf"
                download="fluxograma-curso.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <FiDownload className="w-4 h-4" />
                <span className="hidden sm:inline">Baixar PDF</span>
                <span className="sm:hidden">Baixar</span>
              </a>

              <a
                href="/fluxograma-curso.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
                title="Abrir em nova aba"
              >
                <FiMaximize2 className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PDF VIEWER IFRAME */}
          <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
            <iframe
              src="/fluxograma-curso.pdf#toolbar=1"
              className="w-full h-full border-0"
              title="Fluxograma Curricular PDF"
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
