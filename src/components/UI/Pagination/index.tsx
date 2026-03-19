import { RxChevronRight, RxChevronLeft } from "react-icons/rx";
import { type ReactNode } from "react";

type Props = {
  page: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  onClickPrevPage: () => void;
  onClickPageNext: () => void;
  onClickPage: (page: number) => void;
  className?: string;
  loading: boolean;
};

export default function PageTable({
  page,
  totalPages,
  totalRecords,
  recordsPerPage,
  onClickPrevPage,
  onClickPageNext,
  onClickPage,
  className,
  loading,
}: Props): ReactNode {
  const currentInitialRecord = page * recordsPerPage + 1;
  const currentFinalRecord =
    (page + 1) * recordsPerPage > totalRecords
      ? totalRecords
      : (page + 1) * recordsPerPage;

  const baseButtonClass =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  const renderPageButton = (num: number, isActive?: boolean) => (
    <button
      key={num}
      onClick={() => onClickPage(num - 1)}
      disabled={loading}
      className={`${baseButtonClass} ${
        isActive
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {num}
    </button>
  );

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between mt-6 gap-3 text-sm ${className}`}
    >
      <p className="text-muted-foreground">
        Mostrando{" "}
        <span className="font-semibold text-primary">
          {currentFinalRecord ? currentInitialRecord : 0}
        </span>{" "}
        até{" "}
        <span className="font-semibold text-primary">{currentFinalRecord}</span>{" "}
        de <span className="font-semibold text-primary">{totalRecords}</span>{" "}
        resultados
      </p>

      <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
        {page > 0 && (
          <button
            onClick={onClickPrevPage}
            disabled={loading}
            className={`${baseButtonClass} border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground`}
          >
            <RxChevronLeft className="w-4 h-4" />
          </button>
        )}

        {page > 1 && renderPageButton(1)}
        {page > 2 && (
          <button
            disabled
            className={`${baseButtonClass} border-border bg-background text-muted-foreground`}
          >
            ...
          </button>
        )}

        {page > 0 && renderPageButton(page, false)}
        {renderPageButton(page + 1, true)}
        {page + 1 < totalPages && renderPageButton(page + 2, false)}

        {page + 3 < totalPages && (
          <button
            disabled
            className={`${baseButtonClass} border-border bg-background text-muted-foreground`}
          >
            ...
          </button>
        )}
        {page + 2 < totalPages && renderPageButton(totalPages)}

        {page + 1 < totalPages && (
          <button
            onClick={onClickPageNext}
            disabled={loading}
            className={`${baseButtonClass} border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground`}
          >
            <RxChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
