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
      className="mt-4 block cursor-pointer group hover:bg-[#112b3c]/5 p-2 rounded-lg transition-colors duration-200 no-underline"
    >
      {/* header */}
      <div className="pb-2 text-xs font-bold flex flex-wrap gap-1">
        <span className="text-[#112b3c]">
          {post.category?.name}
        </span>
        <span className="border-l-2 pl-2 text-[#B4B3B2]">
          {formatDateTime(post.createdAt)}
        </span>
      </div>

      {/* conteúdo */}
      <div className="mt-2 grid gap-2 border-l border-[#112b3c] pl-4 md:grid-cols-2">
        {/* título */}
        <p className="min-w-0 text-base font-bold leading-snug md:text-lg line-clamp-3 group-hover:text-secondary transition-colors duration-200 text-slate-900">
          {post.title}
        </p>

        {/* descrição */}
        <p className="min-w-0 text-sm text-[#B4B3B2] leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>
    </Link>
  );
}
