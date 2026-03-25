import { FiInstagram } from "react-icons/fi";
import { motion } from "framer-motion";

const socialLinks = [
  {
    name: "Centro Acadêmico Ciências da Computação",
    handle: "@cacomp.ueva",
    url: "https://www.instagram.com/cacomp.ueva/",
    gradient: "from-[#f09433] via-[#dc2743] to-[#bc1888]",
    tag: "CACOMP",
  },
  {
    name: "Universidade Estadual Vale do Acaraú",
    handle: "@uvacearaoficial",
    url: "https://www.instagram.com/uvacearaoficial/",
    gradient: "from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
    tag: "UVA",
  },
];

export default function SocialSection() {
  return (
    <section className="w-full max-w-7xl mx-auto my-12">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-xl font-bold text-[#112b3c] dark:text-white md:text-2xl">
          Nossas Redes Sociais
        </h2>
        <p className="text-sm text-[#B4B3B2]">
          Acompanhe o dia a dia do curso e da universidade
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {socialLinks.map((social, index) => (
          <motion.a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4 }}
            className="flex items-center gap-6 p-6 bg-white dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
          >
            <div
              className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br ${social.gradient} shadow-lg shrink-0`}
            >
              <FiInstagram className="w-8 h-8 text-white" />
            </div>

            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff7a00] bg-[#ff7a001a] px-2 py-1 rounded-full mb-2 inline-block">
                {social.tag}
              </span>
              <h3 className="text-lg font-bold text-[#112b3c] dark:text-gray-100">{social.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {social.handle}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
