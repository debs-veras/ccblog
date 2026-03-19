import { Outlet } from "react-router-dom";
import ScrollArea from "../../components/UI/ScrollArea";
import PageTitle from "../../components/PageTitle";
import Breadcrumbs from "../../components/Breadcrumbs";
import Sidebar from "../../components/Sidebar";

export default function AdminLayout() {
  return (
    <div className="h-screen flex bg-[#eeeeee] dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0 shadow-sm dark:shadow-none transition-colors duration-200">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <PageTitle />
            </div>
            <Breadcrumbs />
          </div>
        </header>

        <main className="flex-1 min-h-0">
          <ScrollArea className="h-full shadow-inner">
            <div className="pb-10 pt-4 overflow-hidden">
              <Outlet />
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
