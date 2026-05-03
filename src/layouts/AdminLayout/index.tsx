import { Outlet } from "react-router-dom";
import PageTitle from "@/components/PageTitle";
import SidebarApp from "@/components/SidebarApp";
import BreadcrumbApp from "@/components/BreadcrumbApp";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="h-dvh flex bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-300 relative w-full">
          <SidebarApp />

          <SidebarInset className="flex flex-col min-w-0 bg-transparent">
            {/* Header */}
            <header className="flex h-20 shrink-0 items-center gap-2 px-4 sm:px-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-border/50 shadow-sm sticky top-0 z-10 transition-all duration-300">
              <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger className="size-10 hover:bg-orange-500/10 hover:text-orange-500 transition-all duration-300 rounded-xl border border-transparent hover:border-orange-500/20 shadow-none hover:shadow-lg hover:shadow-orange-500/10" />
                    <Separator orientation="vertical" className="h-8 w-[1px] bg-border/60" />
                  </div>
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <PageTitle />
                  </div>
                </div>
                <div className="hidden md:block animate-in fade-in slide-in-from-right-4 duration-500">
                  <BreadcrumbApp />
                </div>
              </div>
            </header>

            <main className="flex-1 min-h-0 px-4 sm:px-6 py-6 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-orange-500/20 scrollbar-track-transparent hover:scrollbar-thumb-orange-500/40 transition-all">
              <div className="max-w-(--breakpoint-2xl) mx-auto pb-10 animate-in fade-in zoom-in-95 duration-500">
                <Outlet />
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}
