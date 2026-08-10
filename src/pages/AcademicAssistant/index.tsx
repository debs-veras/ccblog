import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  FiSend,
  FiUser,
  FiInfo,
  FiMessageSquare,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiBookOpen,
  FiAward,
  FiHelpCircle,
  FiCompass,
} from "react-icons/fi";
import { RiSparklingLine, RiRobot2Line, RiMagicLine } from "react-icons/ri";
import useUserStore from "@/stores/useUserStore";
import useToastLoading from "@/hooks/useToastLoading";
import { askAcademicQuestion, type ChatHistoryItem } from "@/services/ai.service";
import clsx from "clsx";
import AlertConfirm from "@/components/AlertConfirm";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

// Prompt starters rápidos com ícones coloridos
const PROMPT_STARTERS = [
  {
    icon: <FiBookOpen className="w-5 h-5 text-orange-500" />,
    title: "Grade Curricular",
    description: "Quais são as matérias obrigatórias do meu curso?",
    query: "Quais são as disciplinas obrigatórias e optativas da minha grade curricular?",
  },
  {
    icon: <FiCompass className="w-5 h-5 text-sky-500" />,
    title: "Sugestão de Matrícula",
    description: "Como organizar minhas cadeiras no próximo semestre?",
    query: "Me dê uma sugestão de planejamento de matrícula para o próximo semestre.",
  },
  {
    icon: <FiAward className="w-5 h-5 text-emerald-500" />,
    title: "Pré-requisitos & Horas",
    description: "Requisitos de TCC e Horas Complementares.",
    query: "Quais são os pré-requisitos para TCC e como validar minhas horas complementares?",
  },
  {
    icon: <FiHelpCircle className="w-5 h-5 text-purple-500" />,
    title: "Estágio & Carreira",
    description: "Dúvidas sobre regulamento de estágio acadêmico.",
    query: "Como funciona a assinatura de contrato de estágio e relatórios acadêmicos?",
  },
];

// Componente para renderização de mensagens com contraste aprimorado
function FormattedMessage({ content }: { content: string }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeText);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Se o conteúdo contiver blocos HTML, renderizar formatado
  if (content.includes("<p>") || content.includes("<br") || content.includes("<ul>") || content.includes("<table>")) {
    return (
      <div
        className="prose prose-slate dark:prose-invert prose-sm max-w-none leading-relaxed text-[14.5px] prose-p:my-1.5 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-orange-600 dark:prose-strong:text-orange-400 prose-table:border-collapse prose-td:px-3 prose-td:py-1.5 prose-td:border prose-td:border-slate-200 dark:prose-td:border-slate-700 prose-th:px-3 prose-th:py-1.5 prose-th:bg-slate-100 dark:prose-th:bg-slate-800"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Divisão básica por parágrafos/linhas
  const paragraphs = content.split("\n\n");

  return (
    <div className="space-y-3 text-[14.5px] leading-relaxed">
      {paragraphs.map((paragraph, pIdx) => {
        // Bloco de Código
        if (paragraph.startsWith("```")) {
          const codeText = paragraph.replace(/```[a-z]*/g, "").trim();
          return (
            <div key={pIdx} className="relative group/code my-3 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 text-slate-100 font-mono text-xs">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                <span>Código / Exemplo</span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(codeText)}
                  className="flex items-center gap-1 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  {copiedCode === codeText ? (
                    <>
                      <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copiado</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto whitespace-pre-wrap">{codeText}</pre>
            </div>
          );
        }

        // Linhas com marcadores ou negrito
        const formattedLines = paragraph.split("\n").map((line, lineIdx) => {
          if (line.startsWith("- ") || line.startsWith("* ")) {
            return (
              <li key={lineIdx} className="ml-4 list-disc marker:text-orange-500 my-0.5">
                {line.substring(2)}
              </li>
            );
          }
          return (
            <span key={lineIdx} className="block">
              {line}
            </span>
          );
        });

        return <div key={pIdx}>{formattedLines}</div>;
      })}
    </div>
  );
}

export default function AcademicAssistant() {
  const user = useUserStore((s) => s.user);
  const toast = useToastLoading();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chat_history");
    if (saved) {
      try {
        return JSON.parse(saved).map((m: Message) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }));
      } catch (e) {
        console.error("Falha ao carregar histórico", e);
      }
    }
    return [
      {
        id: "welcome",
        text: `Olá, **${user?.name || "Estudante"}**! 🎓\n\nSou o **Assistente Acadêmico do CCBlog**, alimentado por IA. Estou aqui para te ajudar com dúvidas sobre a sua **grade curricular**, **pré-requisitos**, **planejamento de matrícula** e regulamentos do curso.\n\nComo posso te ajudar hoje?`,
        sender: "assistant",
        timestamp: new Date(),
      },
    ];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Persistir no localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Rolar suavemente para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customQuery?: string) => {
    const textToSend = (customQuery || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customQuery) setInput("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const history: ChatHistoryItem[] = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({
        role: (m.sender === "user" ? "user" : "model") as "user" | "model",
        parts: [{ text: m.text }],
      }))
      .slice(-10);

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
      toast({
        tipo: response.type || "error",
        mensagem: response.message || "Não foi possível obter resposta do assistente.",
      });
    }

    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        text: `Histórico limpo. Olá, **${user?.name || "Estudante"}**! Em que posso te ajudar agora?`,
        sender: "assistant",
        timestamp: new Date(),
      },
    ]);
    localStorage.removeItem("chat_history");
    setIsAlertOpen(false);
    toast({ mensagem: "Histórico de conversa limpo!", tipo: "info" });
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ mensagem: "Copiado para a área de transferência!", tipo: "info" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-100 dark:bg-[#070b14] overflow-hidden relative font-sans border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg min-h-0">
      {/* Elementos de Iluminação */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-orange-500/10 dark:bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-sky-500/10 dark:bg-sky-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* TOOLBAR SUPERIOR DO CHAT */}
      <header className="z-10 shrink-0 px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-sm shadow-orange-500/25">
              <RiSparklingLine className="text-white w-4 h-4" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Assistente CCBlog
            </span>
            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
              Gemini AI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAlertOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer shadow-xs"
            title="Limpar Conversa"
          >
            <FiTrash2 className="w-3.5 h-3.5 text-slate-500 hover:text-red-500" />
            <span className="hidden sm:inline">Limpar Chat</span>
          </button>
        </div>
      </header>

      {/* ÁREA DE MENSAGENS DO CHAT */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        <div className="max-w-3xl mx-auto space-y-5">
          <LayoutGroup>
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={clsx(
                    "flex w-full group",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={clsx(
                      "flex gap-3.5 max-w-[95%] sm:max-w-[88%]",
                      message.sender === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    {/* AVATAR */}
                    {message.sender === "assistant" ? (
                      <div className="w-9 h-9 rounded-2xl shrink-0 bg-linear-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20 ring-2 ring-orange-400/20">
                        <RiRobot2Line className="w-5 h-5 text-white" />
                      </div>
                    ) : user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-9 h-9 rounded-2xl shrink-0 object-cover border-2 border-orange-500/40 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-2xl shrink-0 bg-slate-800 text-white font-bold text-sm flex items-center justify-center shadow-md">
                        {user?.name?.charAt(0).toUpperCase() || <FiUser className="w-4 h-4" />}
                      </div>
                    )}

                    {/* BALÃO DE MENSAGEM COM ALTO CONTRASTE */}
                    <div
                      className={clsx(
                        "flex flex-col gap-1.5",
                        message.sender === "user" ? "items-end" : "items-start"
                      )}
                    >
                      <div
                        className={clsx(
                          "relative px-5 py-4 rounded-2xl text-[14.5px] border shadow-md transition-all",
                          message.sender === "assistant"
                            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-800 rounded-tl-xs shadow-slate-200/80 dark:shadow-none"
                            : "bg-linear-to-r from-orange-600 via-orange-600 to-amber-600 text-white border-orange-500/40 rounded-tr-xs shadow-orange-600/20 font-medium"
                        )}
                      >
                        <FormattedMessage content={message.text} />

                        {/* BOTÃO COPIAR RESPOSTA */}
                        {message.sender === "assistant" && (
                          <div className="flex justify-end pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(message.id, message.text)}
                              className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
                            >
                              {copiedId === message.id ? (
                                <>
                                  <FiCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-emerald-500 font-bold">Copiado</span>
                                </>
                              ) : (
                                <>
                                  <FiCopy className="w-3.5 h-3.5" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </LayoutGroup>

          {/* CARD DE SUGESTÕES INICIAIS (STARTERS) */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="pt-2"
            >
              <div className="flex items-center gap-2 mb-3">
                <RiMagicLine className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Sugestões de Perguntas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PROMPT_STARTERS.map((starter, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(starter.query)}
                    className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 text-left transition-all shadow-sm hover:shadow-md cursor-pointer group"
                  >
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-orange-500/10 transition-colors shrink-0">
                      {starter.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {starter.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {starter.description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ANIMAÇÃO DE TYPING / AGUARDANDO RESPOSTA */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start items-center gap-3.5"
            >
              <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                <RiSparklingLine className="w-5 h-5 animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl rounded-tl-xs border border-slate-300 dark:border-slate-800 flex items-center gap-2 shadow-sm">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  Assistente pensando
                </span>
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ÁREA DE ENTRADA DE TEXTO (FIXA NO RODAPÉ) */}
      <div className="z-10 shrink-0 px-4 sm:px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto space-y-2.5">
          {/* BARRA DE BOTÕES RÁPIDOS */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "Grade Curricular", icon: <FiMessageSquare className="w-3.5 h-3.5 text-orange-500" /> },
              { label: "Pré-requisitos", icon: <FiInfo className="w-3.5 h-3.5 text-sky-500" /> },
              { label: "Horas Complementares", icon: <FiAward className="w-3.5 h-3.5 text-emerald-500" /> },
            ].map((tip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(`Quais as regras de ${tip.label.toLowerCase()}?`)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all cursor-pointer shadow-xs"
              >
                {tip.icon}
                {tip.label}
              </button>
            ))}
          </div>

          {/* CAIXA DE TEXTO COM DESTINTO DESTOCAMENTO */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-linear-to-r from-orange-500 to-amber-500 rounded-2xl blur-xs opacity-20 group-focus-within:opacity-40 transition duration-300" />

            <div className="relative flex items-end gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-md">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
                placeholder="Pergunte qualquer dúvida sobre disciplinas, notas, pré-requisitos..."
                className="flex-1 bg-transparent px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none min-h-[46px] max-h-36 text-sm leading-relaxed"
                rows={1}
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-11 h-11 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-40 disabled:grayscale text-white shadow-md shadow-orange-600/20 rounded-xl flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0"
                title="Enviar Mensagem (Enter)"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-medium">
            <span>Pressione <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono rounded text-[10px]">Enter ↵</kbd> para enviar.</span>
            <span className="hidden sm:inline">IA CCBlog • Gemini Academic</span>
          </div>
        </div>
      </div>

      {/* DIÁLOGO DE CONFIRMAÇÃO DE LIMPEZA */}
      <AlertConfirm
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={clearChat}
        title="Limpar Histórico de Conversa"
        description="Tem certeza que deseja apagar o histórico atual de mensagens do assistente?"
        confirmText="Limpar Histórico"
        type="error"
      />
    </div>
  );
}
