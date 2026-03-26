import { useNavigate } from "react-router-dom";

interface OpportunityCardProps {
  tag: string;
  title: string;
  description: string;
  date: string;
  slug: string;
}

export default function OpportunityCard({
  tag,
  title,
  description,
  date,
  slug,
}: OpportunityCardProps) {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-6 bg-white dark:bg-slate-950/40 rounded-xl shadow-md hover:shadow-lg transition-all duration-500 border border-gray-100 dark:border-slate-800/60 hover:border-gray-200 dark:hover:border-slate-700">
      <div>
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2 transition-colors duration-500">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#ff7a00] dark:text-orange-400 bg-[#ff7a001a] px-2 py-1 sm:px-3 rounded-full">
            {tag}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-[#B4B3B2] dark:text-gray-500">
            {date}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-[#112b3c] dark:text-white mb-2 sm:mb-3 line-clamp-2 transition-colors duration-500">
          {title}
        </h3>
        <p className="text-[#B4B3B2] dark:text-gray-400 text-xs sm:text-sm line-clamp-3 mb-4 sm:mb-6 transition-colors duration-500">
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate(`/noticias/${slug}`)}
        className="cursor-pointer w-full bg-[#205375] dark:bg-sky-600 text-white font-bold py-2 sm:py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all duration-300 text-sm sm:text-base mt-auto"
      >
        Saiba mais
      </button>
    </div>
  );
}
