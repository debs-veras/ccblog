import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  type CSSProperties,
} from "react";
import { FiBell, FiX, FiTrash2 } from "react-icons/fi";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { io as clientIO, type Socket } from "socket.io-client";
import useUserStore from "@/stores/useUserStore";
import * as NotificationService from "@/services/notification.service";
import type { NotificationItem } from "@/types/notification";

export default function Notifications() {
  const user = useUserStore((s) => s.user);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    async function load() {
      const res = await NotificationService.getNotifications();
      if (res.success && res.data) setItems(res.data.data);
    }
    load();
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    function update() {
      const rect = buttonRef.current?.getBoundingClientRect();

      const isMobile = window.innerWidth < 640;

      if (isMobile) {
        setStyle({
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          maxHeight: "80vh",
        });
        return;
      }

      if (!rect) return;

      const dropdownWidth = 360;
      let left = rect.left;
      if (left + dropdownWidth + 12 > window.innerWidth) {
        left = Math.max(12, window.innerWidth - dropdownWidth - 12);
      }

      setStyle({
        top: rect.bottom + 8,
        left,
        width: dropdownWidth,
      });
    }

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  useEffect(() => {
    if (!user) return;

    const socket = clientIO(import.meta.env.VITE_URL_API_SO, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", { role: user.role });
    });

    socket.on("new_notification", (p: any) => {
      setItems((prev) => [
        {
          id: p.id,
          title: p.title,
          message: p.message,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    setPortalNode(el);

    return () => {
      document.body.removeChild(el);
    };
  }, []);

  async function markAsRead(id: string) {
    await NotificationService.markNotificationAsRead(id);
    setItems((s) => s.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  async function deleteItem(id: string) {
    await NotificationService.deleteNotification(id);
    setItems((s) => s.filter((n) => n.id !== id));
  }

  const unread = items.filter((i) => !i.read).length;

  return (
    <div>
      <motion.button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
      >
        <FiBell size={20} />

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 rounded-full">
            {unread}
          </span>
        )}
      </motion.button>
      {portalNode &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  className="fixed inset-0 z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                />

                <motion.div
                  style={style}
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className={
                    `
                      fixed z-50
                      bg-white dark:bg-slate-900
                      border border-slate-200 dark:border-slate-700
                      shadow-xl
                      overflow-hidden
                    ` +
                    (style.width === "100%"
                      ? " left-0 right-0 bottom-0 w-full max-h-[80vh] rounded-t-2xl"
                      : " w-[360px] max-h-[420px] rounded-2xl")
                  }
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <FiBell className="text-(--color-secondary)" />
                      <span className="text-sm font-semibold">
                        Notificações
                      </span>
                    </div>

                    <button
                      onClick={() => setOpen(false)}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <FiX />
                    </button>
                  </div>

                  {/* CONTENT */}
                  <div className="max-h-[340px] overflow-y-auto p-3 space-y-2">
                    {items.length === 0 && (
                      <div className="flex flex-col items-center py-10 text-slate-400 text-sm">
                        <FiBell size={24} className="mb-3 opacity-30" />
                        <span>Nada por aqui</span>
                        <span className="text-xs opacity-60">
                          Quando chegar algo, aparece aqui
                        </span>
                      </div>
                    )}

                    <AnimatePresence>
                      {items.map((n) => (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className={`
                            group p-3 rounded-xl border cursor-pointer
                            transition
                            ${
                              n.read
                                ? "bg-slate-50 dark:bg-slate-800 border-transparent opacity-80"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                            }
                            hover:shadow-md
                          `}
                        >
                          <div className="flex justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  {!n.read && (
                                    <span className="w-2 h-2 bg-(--color-secondary) rounded-full animate-pulse" />
                                  )}
                                  <span className="text-sm font-medium">
                                    {n.title}
                                  </span>
                                </div>

                                <span className="text-[10px] text-slate-400">
                                  {new Date(n.createdAt).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>

                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {n.message}
                              </p>
                            </div>

                            {/* ACTIONS */}
                            <div className="opacity-0 group-hover:opacity-100 flex flex-col gap-1 transition">
                              {!n.read && (
                                <button
                                  onClick={() => markAsRead(n.id)}
                                  className="text-xs text-primary-600"
                                >
                                  Marcar
                                </button>
                              )}
                              <button
                                onClick={() => deleteItem(n.id)}
                                className="text-xs text-red-500 flex items-center gap-1"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          portalNode,
        )}
    </div>
  );
}
