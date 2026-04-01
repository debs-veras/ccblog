import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { FiSend, FiUser, FiInfo, FiMessageSquare, FiTrash2 } from "react-icons/fi";
import { RiSparklingLine, RiRobot2Line } from "react-icons/ri";
import { askAcademicQuestion, type ChatHistoryItem } from "../../services/ai.service";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useStorage } from "../../hooks/storage";
import { toast } from "react-toastify";
import clsx from "clsx";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export default function AcademicAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const { getUser } = useStorage();
  const user = getUser();

  // Load history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat_history");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages).map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
        setMessages(parsed);
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    } else {
      // Welcome message
      setMessages([
        {
          id: "welcome",
          text: `Olá${user ? `, ${user.name}` : ""}! Sou o Assistente Acadêmico do CCBlog. Posso te ajudar com dúvidas sobre a grade curricular, professores, pré-requisitos e artigos do blog. Como posso ajudar hoje?`,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
  }, [user]);

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const history: ChatHistoryItem[] = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: (m.sender === "user" ? "user" : "model") as "user" | "model",
        parts: [{ text: m.text }],
      }))
      .slice(-10); // Last 10 messages for context

    try {
      const response = await askAcademicQuestion(userMessage.text, history);
      if (response.success && response.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.answer,
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        toast.error(response.message || "Erro ao obter resposta do assistente.");
      }
    } catch {
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Deseja realmente limpar o histórico do chat?")) {
      setMessages([
        {
          id: "welcome",
          text: "Histórico limpo. Como posso te ajudar agora?",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
      localStorage.removeItem("chat_history");
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#020617] overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-500/10 dark:bg-orange-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-orange-400/5 dark:bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Assistant Header */}
      <header className="z-10 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <RiSparklingLine className="text-white w-6 h-6" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Assistente Acadêmico</h2>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sempre Online • IA do CCBlog</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
            title="Limpar Conversa"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </header>

      {/* Chat Area - Full Width */}
      <ScrollArea.Root className="flex-1 w-full bg-transparent overflow-hidden">
        <ScrollArea.Viewport className="w-full h-full px-4 sm:px-8 py-6" ref={scrollViewportRef}>
          <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            <LayoutGroup>
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={clsx(
                      "flex w-full",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={clsx(
                      "flex gap-4 max-w-[90%] sm:max-w-[80%]",
                      message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    )}>
                      {/* Avatar Minimalist */}
                      <div className={clsx(
                        "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-1",
                        message.sender === "assistant" 
                          ? "bg-slate-200 dark:bg-slate-800 text-orange-600 dark:text-orange-500" 
                          : "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                      )}>
                        {message.sender === "assistant" ? <RiRobot2Line size={16} /> : <FiUser size={16} />}
                      </div>

                      {/* Content Bubble */}
                      <div className={clsx(
                        "flex flex-col gap-1.5",
                        message.sender === "user" ? "items-end" : "items-start"
                      )}>
                        <div className={clsx(
                          "px-5 py-3.5 rounded-2xl text-[14.5px] leading-relaxed shadow-xs border transition-all",
                          message.sender === "assistant"
                            ? "bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm text-slate-800 dark:text-slate-200 border-slate-200/60 dark:border-slate-800/60 rounded-tl-none hover:border-slate-300 dark:hover:border-slate-700"
                            : "bg-linear-to-br from-orange-500 to-orange-600 text-white border-orange-400 rounded-tr-none shadow-md shadow-orange-600/10"
                        )}>
                          {message.text}
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </LayoutGroup>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-orange-600 dark:text-orange-500 flex items-center justify-center animate-pulse">
                    <RiSparklingLine size={16} />
                  </div>
                  <div className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm px-5 py-4 rounded-2xl rounded-tl-none border border-slate-200/50 dark:border-slate-800/50 flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-bounce [animation-duration:0.8s]"></span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-160 ease-out hover:bg-black/5 dark:hover:bg-white/5 data-[orientation=vertical]:w-2"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-slate-300/60 dark:bg-slate-700/60 rounded-full relative" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>

      {/* Input Area - Full Screen Floating Style */}
      <div className="z-10 px-6 py-6 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          
          {/* Quick Actions moved inside Input area for accessibility */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { icon: <FiMessageSquare />, label: "Grade Curricular" },
              { icon: <FiInfo />, label: "Pré-requisitos" },
              { icon: <RiSparklingLine />, label: "Sugestão de Matrícula" },
            ].map((tip, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setInput(`Fale sobre ${tip.label.toLowerCase()}`)}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-900/50 px-3.5 py-2 rounded-lg border border-slate-200/50 dark:border-slate-800/50 hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-500 transition-all"
              >
                {tip.icon}
                {tip.label}
              </motion.button>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-orange-600 to-orange-400 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative flex items-end gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-orange-500/5">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto height logic if needed
                  e.target.style.height = 'inherit';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Escreva sua mensagem..."
                className="flex-1 bg-transparent px-4 py-3 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none min-h-12 max-h-40 text-[15px]"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 dark:hover:bg-orange-600 disabled:opacity-30 disabled:grayscale text-white shadow-lg shadow-orange-600/20 rounded-xl flex items-center justify-center transition-all active:scale-90"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-slate-400 font-medium">
            Lembre-se: Sou uma IA e posso cometer erros. Verifique informações críticas com a coordenação.
          </p>
        </div>
      </div>
    </div>
  );
}
