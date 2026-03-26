import { Link } from "react-router-dom";
import type { Post } from "../../../../types/post";
import { formatDateTime } from "../../../../utils/formatar";

type CardListProps = {
  post: Post;
};

export default function CardList({ post }: CardListProps) {
  return (
    <Link
      to={`/noticias/${post.slug}`}
      className="mt-4 block cursor-pointer group hover:bg-[#112b3c]/5 dark:hover:bg-slate-800/50 p-3 rounded-xl transition-all duration-300 no-underline border border-transparent dark:border-slate-800/0 dark:hover:border-slate-800"
    >
      {/* header */}
      <div className="pb-2 text-xs font-bold flex flex-wrap gap-1 transition-colors duration-500">
        <span className="text-[#112b3c] dark:text-sky-400">
          {post.category?.name}
        </span>
        <span className="border-l-2 dark:border-slate-700 pl-2 text-[#B4B3B2] dark:text-gray-500">
          {formatDateTime(post.createdAt)}
        </span>
      </div>

      {/* conteúdo */}
      <div className="mt-2 grid gap-2 border-l border-[#112b3c] dark:border-sky-500 pl-4 md:grid-cols-2 transition-all duration-500">
        {/* título */}
        <p className="min-w-0 text-base font-bold leading-snug md:text-lg line-clamp-3 group-hover:text-secondary dark:group-hover:text-sky-400 transition-colors duration-300 text-slate-900 dark:text-white">
          {post.title}
        </p>

        {/* descrição */}
        <p className="min-w-0 text-sm text-[#B4B3B2] dark:text-gray-400 leading-relaxed line-clamp-3 transition-colors duration-500">
          {post.description}
        </p>
      </div>
    </Link>
  );
}
