import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaShareAlt,
  FaEye,
  FaCheck,
} from "react-icons/fa";

import { getPostBySlug } from "../../services/post.service";
import type { Post } from "../../types/post";
import useToastLoading from "../../hooks/useToastLoading";
import LoadingPage from "../../components/LoadingPage";
import { formatDateTime } from "../../utils/formatar";

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const toast = useToastLoading();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      setLoading(true);
      const response = await getPostBySlug(slug);

      if (response.success && response.data) setPost(response.data);
      else {
        toast({ mensagem: "Notícia não encontrada", tipo: "error" });
        navigate("/noticias");
      }

      setLoading(false);
    };

    loadPost();
  }, [slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      toast({ mensagem: "Link copiado!", tipo: "success" });

      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ mensagem: "Erro ao copiar link", tipo: "error" });
    }
  };

  if (loading) return <LoadingPage />;
  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 pb-20"
    >
      {/* HERO */}
      <section className="w-full pt-24 sm:pt-32 pb-16 border-b border-slate-200 dark:border-slate-800 transition-colors duration-500">
        <div className="space-y-6">
          {/* VOLTAR */}
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            <FaChevronLeft className="text-xs" />
            Voltar
          </Link>

          {/* CATEGORIA */}
          {post.category && (
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-block bg-orange-500/10 text-orange-600 dark:text-orange-400 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-orange-500/20 transition-colors duration-500"
            >
              # {post.category.name}
            </motion.span>
          )}

          {/* TÍTULO */}
          <h1 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter uppercase transition-colors duration-500">
            {post.title}
          </h1>

          {/* META + SHARE */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-gray-400 transition-colors duration-500">
              <span className="flex items-center gap-2">
                <FaCalendarAlt />
                {formatDateTime(post.createdAt)}
              </span>

              <span className="flex items-center gap-2">
                <FaEye />
                {post.views || 0} visualizações
              </span>
            </div>

            {/* SHARE BUTTON */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-500 transition-colors transition-transform duration-300 text-[10px] font-black uppercase tracking-widest active:scale-95 bg-white dark:bg-slate-950/50 backdrop-blur-sm"
            >
              {copied ? <FaCheck /> : <FaShareAlt />}
              {copied ? "LINK_COPIED" : "SHARE_STORY"}
            </button>
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex-1 pt-10 space-y-8"
      >
        {/* AUTHOR */}
        <div className="flex items-center gap-4 transition-colors duration-500">
          <div className="bg-slate-100 dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center font-bold text-slate-600 dark:text-gray-300 transition-colors duration-500 shadow-inner">
            {post.author?.name?.[0] || "C"}
          </div>

          <div>
            <p className="font-semibold text-slate-900 dark:text-white transition-colors duration-500">
              {post.author?.name || "Ciência da Computação"}
            </p>
            <p className="text-xs text-slate-400 dark:text-gray-500 transition-colors duration-500">Autor</p>
          </div>
        </div>

        {/* DESCRIPTION */}
        {post.description && (
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed border-l-4 border-orange-500 pl-8 transition-colors duration-500">
            {post.description}
          </p>
        )}

        {/* CONTENT */}
        <div
          className="
            ql-editor
            prose
            prose-lg
            prose-slate
            dark:prose-invert
            max-w-none
            prose-headings:font-semibold
            prose-headings:tracking-tight
            prose-p:leading-relaxed
            prose-a:text-[#205375]
            dark:prose-a:text-sky-400
            hover:prose-a:opacity-80
            prose-img:rounded-xl
            prose-img:shadow-md
            transition-colors
            duration-500
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.section>
    </motion.div>
  );
}
