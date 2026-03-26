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
    <div className="h-full flex flex-col justify-between p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600">
      <div>
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <span className=" text-[10px] sm:text-xs font-bold uppercase tracking-wider color-secondary bg-[#ff7a001a] px-2 py-1 sm:px-3 rounded-full">
            {tag}
          </span>
          <span className="text-[10px] sm:text-xs font-bold color-subtext">
            {date}
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold color-primary dark:text-white mb-2 sm:mb-3 line-clamp-2">
          {title}
        </h3>
        <p className="color-subtext dark:text-gray-400 text-xs sm:text-sm line-clamp-3 mb-4 sm:mb-6">
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate(`/noticias/${slug}`)}
        className="cursor-pointer w-full background-primary text-white font-bold py-2 sm:py-3 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base mt-auto"
      >
        Saiba mais
      </button>
    </div>
  );
}
