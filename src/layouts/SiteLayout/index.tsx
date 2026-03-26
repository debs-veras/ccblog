import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Banner from "../Sections/Banner";
import Footer from "../Sections/Footer";
import Loading from "../../components/Loading";

export default function SiteLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />
      <header>
        <Banner />
      </header>
      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
