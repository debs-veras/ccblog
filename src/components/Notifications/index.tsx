import { useEffect, useState, useRef } from "react";
import { Bell, Trash2, Inbox, X } from "lucide-react";
import { io as clientIO, type Socket } from "socket.io-client";
import useUserStore from "@/stores/useUserStore";
import * as NotificationService from "@/services/notification.service";
import type { NotificationItem } from "@/types/notification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

export default function Notifications() {
  const user = useUserStore((s) => s.user);
  const { isMobile } = useSidebar();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    async function load() {
      const res = await NotificationService.getNotifications();
      if (res.success && res.data) setItems(res.data.data);
    }
    load();
  }, []);

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

  async function markAsRead(id: string) {
    await NotificationService.markNotificationAsRead(id);
    setItems((s) => s.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  async function markAllAsRead() {
    await NotificationService.markAllNotificationsAsRead();
    setItems((s) => s.map((n) => ({ ...n, read: true })));
  }

  async function deleteItem(id: string) {
    await NotificationService.deleteNotification(id);
    setItems((s) => s.filter((n) => n.id !== id));
  }

  const unread = items.filter((i) => !i.read).length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-xl hover:bg-orange-500/10 text-muted-foreground hover:text-[#ff7a00] transition-all duration-300 border border-transparent hover:border-orange-500/20 group/bell outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20"
          title="Notificações"
        >
          <Bell className="size-5 transition-transform group-hover/bell:scale-110" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 bg-orange-500 text-white text-[9px] font-bold px-1 rounded-full flex items-center justify-center min-w-[15px] h-3.5 shadow-sm border border-white dark:border-slate-900 animate-in fade-in zoom-in duration-300">
              {unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-80 sm:w-96 rounded-2xl p-0 shadow-2xl border-border/50 overflow-hidden"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={12}
      >
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center justify-between px-4 py-4 bg-linear-to-br from-orange-500/5 to-transparent border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Bell className="size-4 text-orange-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#112b3c] dark:text-white leading-none">
                  Central de Notificações
                </span>
                <span className="text-[10px] text-muted-foreground font-medium mt-1">
                  {unread > 0 ? `${unread} novas mensagens` : "Tudo em dia!"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </DropdownMenuLabel>

        <div className="max-h-[400px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4">
                <Inbox className="size-8 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-sm font-bold text-[#112b3c] dark:text-white">
                Nenhuma notificação
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                Avisaremos você assim que algo novo acontecer.
              </p>
            </div>
          ) : (
            items.map((n) => (
              <div
                key={n.id}
                className={`
                  group relative flex gap-3 p-3 rounded-xl transition-all duration-200 border
                  ${
                    n.read
                      ? "bg-transparent border-transparent opacity-60"
                      : "bg-orange-500/5 border-orange-500/10 hover:border-orange-500/30 hover:shadow-sm"
                  }
                `}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <span className="size-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
                      )}
                      <span className="text-sm font-bold text-[#112b3c] dark:text-white truncate">
                        {n.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-700 underline underline-offset-2"
                    >
                      Lido
                    </button>
                  )}
                  <button
                    onClick={() => deleteItem(n.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <>
            <DropdownMenuSeparator className="mx-0" />
            <div className="p-2">
              <button
                className="w-full py-2 text-[10px] font-bold text-muted-foreground hover:text-orange-500 transition-colors uppercase tracking-widest"
                onClick={markAllAsRead}
              >
                Marcar todas como lidas
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
