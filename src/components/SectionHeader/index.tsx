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
      className={`space-y-4 ${
        centerOnMobile ? "text-center sm:text-left" : "text-left"
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className={`flex items-center gap-3 ${centerOnMobile ? "justify-center sm:justify-start" : "justify-start"}`}>
          <div className="h-0.5 w-8 bg-orange-500 rounded-full"></div>
          <span className="text-[10px] font-mono text-orange-500 font-bold uppercase tracking-[0.3em]">
            System.v2
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter uppercase transition-colors duration-500">
          {title}
        </h1>
      </div>

      {description && (
        <p className="max-w-2xl text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors duration-500">
          {description}
        </p>
      )}
    </div>
  );
}
