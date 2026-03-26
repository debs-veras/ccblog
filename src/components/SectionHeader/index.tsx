interface SectionHeaderProps {
  title: string;
  description?: string;
  centerOnMobile?: boolean;
}

export function SectionHeader({
  title,
  description,
  centerOnMobile = true,
}: SectionHeaderProps) {
  return (
    <div
      className={`space-y-2 ${
        centerOnMobile ? "text-center sm:text-left" : "text-left"
      }`}
    >
      <h1 className="text-3xl font-bold text-[#112b3c] dark:text-white transition-colors duration-500">
        {title}
      </h1>

      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
          {description}
        </p>
      )}
    </div>
  );
}
