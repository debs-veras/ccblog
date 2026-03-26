import { motion } from "framer-motion";
import { FiCode, FiTerminal } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Hero.css";

export default function TechHero() {
  return (
    <section className="relative w-full overflow-hidden pt-32 sm:pt-44 pb-20 sm:pb-32 lg:pb-40 transition-colors duration-700">
      <div className="scanline" />

      {/* Animated Glows */}
      <div className="absolute top-1/4 -left-20 w-80 sm:w-120 h-80 sm:h-120 bg-sky-500/10 dark:bg-sky-500/20 rounded-full blur-[60px] sm:blur-[100px] animate-pulse will-change-transform"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 sm:w-120 h-80 sm:h-120 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[80px] sm:blur-[100px] animate-pulse delay-700 will-change-transform"></div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-10 text-center lg:text-left relative flex flex-col items-center lg:items-start"
          >
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-[9px] sm:text-xs font-black font-mono uppercase tracking-[0.2em] shadow-sm leading-tight max-w-[calc(100vw-3rem)] sm:max-w-full">
              <span className="text-orange-500 font-bold underline decoration-orange-500/30 shrink-0">
                SEC_01
              </span>
              <span className="hidden sm:block w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full shrink-0"></span>
              <span className="text-center sm:text-left">
                Universidade Estadual Vale do Acaraú
              </span>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] lg:leading-[0.9] tracking-tighter wrap-break-word">
                CIÊNCIAS DA <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 drop-shadow-sm filter dark:drop-shadow-[0_0_15px_rgba(255,122,0,0.3)]">
                  COMPUTAÇÃO
                </span>
              </h1>
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <div className="h-1 w-16 sm:h-1.5 sm:w-24 bg-orange-500 rounded-full"></div>
                <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 font-bold tracking-[0.3em]">
                  Complexity: O(n!)
                </span>
              </div>
            </div>

            <p className="max-w-xl mx-auto lg:mx-0 text-sm sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Arquitetando o futuro através de{" "}
              <span className="text-slate-900 dark:text-white font-bold decoration-orange-500/30 underline decoration-2 underline-offset-4">
                algoritmos
              </span>
              , inovação e{" "}
              <span className="text-slate-900 dark:text-white font-bold decoration-sky-500/30 underline decoration-2 underline-offset-4">
                engenharia
              </span>{" "}
              na Universidade Estadual Vale do Acaraú.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-6 pt-4 sm:pt-6">
              <Link
                to="/noticias"
                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-orange-900/10 flex items-center justify-center gap-3 group text-xs sm:text-sm uppercase tracking-widest"
              >
                INICIAR JORNADA{" "}
                <FiCode className="group-hover:rotate-12 transition-transform" />
              </Link>
              <Link
                to="/matriz-curricular"
                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-orange-500/50 text-slate-900 dark:text-white rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-3 shadow-md text-xs sm:text-sm uppercase tracking-widest"
              >
                GRADUAÇÃO <FiTerminal />
              </Link>
            </div>
          </motion.div>

          {/* Right Part - Tech Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="hidden lg:block relative perspective-1000 w-full max-w-2xl mx-auto lg:mx-0 lg:max-w-none will-change-transform"
          >
            <div className="terminal-window backdrop-blur-md sm:backdrop-blur-2xl bg-white/90 dark:bg-slate-950/80 border-2 border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="terminal-header flex items-center justify-between px-6 py-4 border-b-2 border-slate-200 dark:border-slate-800">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/40"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/40"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500/40"></div>
                </div>
                <div className="text-[9px] font-mono text-slate-400 font-bold tracking-widest">
                  [ UVA_CS_CORE_2026 ]
                </div>
              </div>

              <div className="terminal-body p-6 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 uppercase text-[9px] sm:text-[10px] font-black tracking-widest">
                      Graduação:
                    </span>
                    <span className="text-orange-600 font-bold uppercase tracking-tight">
                      Bacharelado
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-slate-500 dark:text-slate-400 uppercase text-[9px] sm:text-[10px] font-black tracking-widest">
                      Ranking:
                    </span>
                    <span className="text-slate-900 dark:text-white font-black underline decoration-sky-500 text-[11px] sm:text-sm">
                      MEC_GRAU_5_EXCELLENCE
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[9px] sm:text-[10px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest">
                      Deploy de Conhecimento
                    </p>
                    <span className="text-[9px] sm:text-[10px] font-black text-emerald-500">
                      100% SYNC
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-linear-to-r from-orange-600 to-orange-400 shadow-[0_0_10px_rgba(255,122,0,0.3)]"
                    />
                  </div>
                </div>

                <p className="text-slate-900 dark:text-white mt-8 font-black text-base sm:text-lg">
                  &gt;{" "}
                  <span className="text-slate-400 uppercase tracking-widest text-[9px] sm:text-[10px]">
                    FUTURE_ARCHITECTS_LOADING...
                  </span>
                  <span className="typing-cursor">_</span>
                </p>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-right-8 p-4 sm:p-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-20 flex flex-col items-center justify-center min-w-28 sm:min-w-35 will-change-transform"
            >
              <div className="text-[8px] sm:text-[9px] font-mono text-orange-500 font-bold mb-1 sm:mb-2 tracking-widest">
                [ID: 0x2A]
              </div>
              <div className="text-orange-500 text-3xl sm:text-5xl font-black tracking-tighter leading-none mb-1 sm:mb-2">
                4.5
              </div>
              <div className="text-[8px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-center leading-tight">
                ANOS DE
                <br />
                FORMAÇÃO
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
