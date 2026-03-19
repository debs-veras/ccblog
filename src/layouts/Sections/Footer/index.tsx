import { FiMail, FiPhone, FiMapPin, FiGithub } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="mt-16 w-full bg-[#112b3c] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* SOBRE */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Sobre</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Portal informativo do curso de Ciências da Computação da UVA,
            reunindo notícias, contatos e informações acadêmicas.
          </p>
        </div>

        {/* LINKS */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Links rápidos</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="hover:text-white cursor-pointer transition">
              Início
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Notícias
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Contatos
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Atividades Complementares
            </li>
          </ul>
        </div>

        {/* CONTATO */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Contato</h3>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FiMail />
            contato@uvanet.br
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FiPhone />
            (88) 0000-0000
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FiMapPin />
            Sobral - CE
          </div>
        </div>

        {/* DEV */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Desenvolvimento</h3>
          <p className="text-sm text-gray-300">
            Desenvolvido para fins acadêmicos.
          </p>

          <a
            href="https://github.com/"
            target="_blank"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
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
