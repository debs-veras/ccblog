import { useState } from "react";
import {
  FiPhone,
  FiMail,
  FiCopy,
  FiCheck,
  FiFileText,
  FiX,
} from "react-icons/fi";

export default function ContactSection() {
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [openPDF, setOpenPDF] = useState(false);

  const contacts = [
    {
      title: "CCET - Centro de Ciências Exatas e Tecnologia",
      phone: "3611-6399",
      email: "ccet@uvanet.br",
    },
    {
      title: "Coordenação - Curso de Ciências da Computação",
      phone: "3677-4222",
      email: "computacao_coordenacao@uvanet.br",
    },
    {
      title: "Centro Acadêmico - Ciências da Computação",
      phone: "Não informado",
      email: "centroacademico@uvanet.br",
      highlight: true,
    },
  ];

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [key]: false }));
      }, 1200);
    } catch (err) {
      console.error("Erro ao copiar", err);
    }
  };

  return (
    <section className="my-12 w-full max-w-7xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#112b3c] sm:text-2xl">
            Contatos
          </h2>
          <p className="text-sm text-[#B4B3B2]">
            Fale com os principais setores da universidade
          </p>
        </div>

        <button
          onClick={() => setOpenPDF(true)}
          className="flex items-center justify-center gap-2 rounded-md border border-[#205375] px-4 py-2 text-sm font-medium text-[#205375] transition hover:bg-[#205375]/10 active:scale-95"
        >
          <FiFileText />
          Ver todos
        </button>
      </div>

      {/* LISTA */}
      <div className="divide-y border-t border-b">
        {contacts.map((item, index) => (
          <div
            key={index}
            className={`group flex flex-col gap-3 py-4 transition hover:bg-[#f5f7f9] sm:flex-row sm:items-center sm:justify-between ${
              item.highlight ? "bg-[#205375]/5" : ""
            }`}
          >
            <div className="space-y-2 w-full">
              <h3 className="font-semibold text-[#112b3c]">{item.title}</h3>

              <div className="flex flex-col gap-2 text-sm text-[#6b7280] sm:flex-row sm:flex-wrap sm:gap-6">
                {/* TELEFONE */}
                <div className="flex items-center gap-2">
                  <FiPhone className="text-[#205375]" />
                  <span className="break-all">{item.phone}</span>

                  {item.phone !== "Não informado" && (
                    <button
                      onClick={() => handleCopy(item.phone, `phone-${index}`)}
                      className="ml-1 text-[#205375] opacity-70 transition hover:opacity-100 hover:scale-110"
                    >
                      {copied[`phone-${index}`] ? <FiCheck /> : <FiCopy />}
                    </button>
                  )}
                </div>

                {/* EMAIL */}
                <div className="flex items-center gap-2">
                  <FiMail className="text-[#205375]" />
                  <span className="break-all">{item.email}</span>

                  <button
                    onClick={() => handleCopy(item.email, `email-${index}`)}
                    className="ml-1 text-[#205375] opacity-70 transition hover:opacity-100 hover:scale-110"
                  >
                    {copied[`email-${index}`] ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PDF */}
      {openPDF && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4">
          <div className="relative h-[95vh] w-full max-w-6xl rounded-lg bg-white shadow-xl">
            {/* HEADER MODAL */}
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="text-sm font-medium text-[#112b3c]">
                Lista completa de contatos
              </span>

              <button
                onClick={() => setOpenPDF(false)}
                className="text-gray-500 hover:text-black"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* PDF */}
            <iframe
              src="/contatos.pdf"
              className="h-[calc(100%-40px)] w-full"
            />
          </div>
        </div>
      )}
    </section>
  );
}
