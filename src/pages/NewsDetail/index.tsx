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
  }, [slug, navigate, toast]);

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
      <section className="w-full pt-12 pb-10 border-b border-slate-200 dark:border-slate-800 transition-all duration-500">
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
              className="inline-block bg-[#205375]/10 dark:bg-sky-500/10 text-[#205375] dark:text-sky-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-500"
            >
              {post.category.name}
            </motion.span>
          )}

          {/* TÍTULO */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight transición-colors duration-500">
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-gray-400 hover:border-[#205375] dark:hover:border-sky-500 hover:text-[#205375] dark:hover:text-sky-400 transition-all duration-300 text-sm active:scale-95"
            >
              {copied ? <FaCheck /> : <FaShareAlt />}
              {copied ? "Copiado" : "Compartilhar"}
            </button>
          </div>
        </div>
      </section>

      {/* CONTEÚDO */}
      <section className="flex-1 pt-10 space-y-8">
        {/* AUTHOR */}
        <div className="flex items-center gap-4 transition-all duration-500">
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
          <p className="text-lg text-slate-600 dark:text-gray-300 italic border-l-4 border-[#205375]/40 dark:border-sky-500/40 pl-5 transition-all duration-500">
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
            transition-all
            duration-500
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>
    </motion.div>
  );
}
