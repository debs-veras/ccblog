import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX, FiCode } from "react-icons/fi";
import { HiSun, HiMoon } from "react-icons/hi";
import { useStorage } from "../../hooks/storage";
import { useTheme } from "../../contexts/ThemeContext";

export default function Navbar() {
  const { getUser } = useStorage();
  const user = getUser();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: "Início", path: "/" },
    { 
      name: user ? "Dashboard" : "Login", 
      path: user 
        ? (user.role === "STUDENT" ? "/dashboard/aluno" : 
           user.role === "TEACHER" ? "/dashboard/professor" : 
           user.role === "ADMIN" ? "/users" : "/posts") 
        : "/login" 
    },
    { name: "Buscar", path: "/noticias" },
    { name: "Sobre o Curso", path: "/sobre-curso" },
    { name: "Atividades Complementares", path: "/atividades-complementares" },
    { name: "Matriz Curricular", path: "/matriz-curricular" },
    { name: "Atlética", path: "/atletica" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-2 sm:py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-2xl border-b border-slate-200 dark:border-slate-800/50"
          : "py-4 sm:py-6 bg-transparent"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 transition-all duration-300">
        <div className="flex justify-between items-center py-3">
          {/* 1. Logo (Left) */}
          <div className="flex-initial">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-orange-600 dark:bg-orange-500 p-2 rounded-xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <FiCode size={20} className="stroke-3" />
              </div>
              <span className={`hidden sm:block font-black text-2xl tracking-tighter transition-colors duration-500 ${
                scrolled || theme === "dark" ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white"
              }`}>
                CC<span className="text-orange-600 dark:text-orange-500">Blog</span>
              </span>
            </Link>
          </div>

          {/* 2. Desktop Menu (Center) */}
          <div className="hidden lg:flex flex-1 justify-center px-4">
            <div className="flex items-center bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? "bg-orange-600 dark:bg-orange-500 text-white shadow-lg"
                        : "text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-500"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* 3. Controls (Right) */}
          <div className="flex-initial flex items-center gap-3">
            {/* Theme Toggle Desktop */}
            <button
              onClick={toggleTheme}
              className="hidden lg:flex p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-500 transition-all duration-300 shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <HiMoon size={20} /> : <HiSun size={20} />}
            </button>

            {/* Mobile Menu Button Group */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                aria-label="Toggle Theme"
              >
                {theme === "light" ? <HiMoon size={20} /> : <HiSun size={20} />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full px-4 transition-all duration-300 origin-top overflow-hidden ${
          isOpen ? "opacity-100 scale-y-100 mt-2" : "opacity-0 scale-y-0 h-0"
        }`}
      >
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-200 ${
                  isActive
                    ? "bg-orange-600 dark:bg-orange-500 text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-orange-600 dark:hover:text-orange-500"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
