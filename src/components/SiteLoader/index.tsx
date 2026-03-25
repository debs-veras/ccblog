import { motion } from "framer-motion";

export default function SiteLoader() {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm dark:bg-gray-900/80 transition-colors duration-300">
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          {/* Anel externo rotacionando */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-28 w-28 rounded-full border-[3px] border-transparent border-t-[#205375] border-r-[#205375] opacity-80"
          />
          
          {/* Anel interno girando no sentido contrário */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-20 w-20 rounded-full border-[3px] border-transparent border-b-[#f66b0e] border-l-[#f66b0e] opacity-90"
          />
          
          {/* Logotipo central pulsando levemente */}
          <motion.div 
            initial={{ scale: 0.85, opacity: 0.8 }}
            animate={{ scale: [0.85, 1.05, 0.85], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-[#205375] to-[#112b3c] dark:from-white dark:to-gray-300"
          >
            CC
          </motion.div>
        </div>

        {/* Texto elegante */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <span className="text-sm font-bold text-[#112b3c] dark:text-gray-200 tracking-[0.3em] uppercase">
            Carregando
          </span>
          <div className="flex items-center gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.2,
                }}
                className="w-1.5 h-1.5 rounded-full bg-[#f66b0e]"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
