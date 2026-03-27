import { FiMail, FiPhone, FiMapPin, FiGithub } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className=" mt-16 w-full bg-[#112b3c] dark:bg-slate-950 text-white transition-colors duration-500">
      <div className="mx-auto grid container gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* SOBRE */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Sobre</h3>
          <p className="text-sm text-gray-300 dark:text-gray-400 leading-relaxed">
            Portal informativo do curso de Ciências da Computação da UVA,
            reunindo notícias, contatos e informações acadêmicas.
          </p>
        </div>

        {/* CONTATO */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Contato</h3>

          <div className="flex items-center gap-2 text-sm text-gray-300 dark:text-gray-400">
            <FiMail />
            contato@uvanet.br
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300 dark:text-gray-400">
            <FiPhone />
            (88) 0000-0000
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300 dark:text-gray-400">
            <FiMapPin />
            Sobral - CE
          </div>
        </div>

        {/* DEV */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Desenvolvimento</h3>
          <p className="text-sm text-gray-300 dark:text-gray-400">
            Desenvolvido para fins acadêmicos.
          </p>

          <a
            href="https://github.com/debs-veras/ccblog/"
            target="_blank"
            className="flex items-center gap-2 text-sm text-gray-300 dark:text-gray-400 hover:text-white transition"
          >
            <FiGithub />
            GitHub
          </a>
        </div>
      </div>

      {/* LINHA FINAL */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Universidade Estadual Vale do Acaraú. Todos
        os direitos reservados.
      </div>
    </footer>
  );
}
