import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX, FiCode } from "react-icons/fi";

const navLinks = [
  { name: "Início", path: "/" },
  { name: "Login", path: "/login" },
  { name: "Buscar", path: "/noticias" },
  { name: "Sobre o Curso", path: "/sobre-curso" },
  { name: "Atividades Complementares", path: "/atividades-complementares" },
  { name: "Matriz Curricular", path: "/matriz-curricular" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-2 sm:py-4 bg-[var(--color-primary)]/90 backdrop-blur-xl shadow-2xl border-b border-white/5"
          : "py-4 sm:py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className={`flex justify-between items-center px-6 py-3  `}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-[var(--color-secondary)] p-2 rounded-full text-white shadow-[0_0_15px_rgba(255,122,0,0.5)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <FiCode size={20} className="stroke-[3]" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white drop-shadow-md">
              CC<span className="text-[var(--color-secondary)]">Blog</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--color-secondary)] text-white shadow-[0_0_10px_rgba(255,122,0,0.4)]"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-[var(--color-secondary)] transition-colors p-2 bg-white/5 rounded-full border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-full left-0 w-full px-4 transition-all duration-300 origin-top overflow-hidden ${
          isOpen ? "opacity-100 scale-y-100 mt-2" : "opacity-0 scale-y-0 h-0"
        }`}
      >
        <div className="bg-[var(--color-primary)]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--color-secondary)] text-white shadow-md"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
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
