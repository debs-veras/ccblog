export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4 border-gray-200 dark:border-gray-700" />
        <div className="absolute left-0 top-0 h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Carregando resultados...
      </p>
    </div>
  );
}
