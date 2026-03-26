import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import type { Post, SearchPostParams } from "../../types/post";
import { searchPosts } from "../../services/post.service";
import { getCategories } from "../../services/category.service";
import useToastLoading from "../../hooks/useToastLoading";
import useDebounce from "../../hooks/useDebounce";
import type { Category } from "../../types/category";
import LoadingPage from "../../components/LoadingPage";
import { formatDateTime } from "../../utils/formatar";

type PostFiltersForm = Omit<SearchPostParams, "published"> & {
  published?: boolean | "" | "true" | "false";
  categoryId?: string;
};

const parsePublishedFilter = (
  published?: PostFiltersForm["published"],
): boolean | undefined => {
  if (published === "" || published === undefined) return undefined;
  if (published === true || published === "true") return true;
  if (published === false || published === "false") return false;
  return undefined;
};

export default function NewsPage() {
  const toast = useToastLoading();
  const { register, watch, handleSubmit } = useForm<PostFiltersForm>();
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRegister, setTotalRegister] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const registerForPage = 5;
  const [loading, setLoading] = useState(false);

  const loadPosts = async (
    pageSize: number = registerForPage,
    page: number = 0,
    append: boolean = false,
  ) => {
    setLoading(true);

    let filters: SearchPostParams = { page: page + 1, limit: pageSize };

    await handleSubmit((dataForm) => {
      filters = {
        ...filters,
        title: dataForm.title,
        categoryId:
          dataForm.categoryId && dataForm.categoryId !== "all"
            ? dataForm.categoryId
            : undefined,
        startDate: dataForm.startDate,
        endDate: dataForm.endDate,
        published: parsePublishedFilter(dataForm.published),
        author: dataForm.author,
      };
    })();

    const response = await searchPosts(filters);

    if (response.success && response.data) {
      const pageInfo = response.data.pagination;

      setCurrentPage(pageInfo.page - 1);
      setTotalRegister(pageInfo.total);
      setTotalPage(pageInfo.totalPages);

      const newPosts = response.data.data || [];
      setVisiblePosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
    } else toast({ mensagem: response.message, tipo: response.type });

    setLoading(false);
  };

  const debouncedSearch = useDebounce(loadPosts, 400);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await getCategories();
      if (response.success && response.data) setCategories(response.data);
    };

    loadCategories();
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscription = watch(() => {
      setVisiblePosts([]);
      debouncedSearch(registerForPage, 0, false);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mx-auto pt-24 sm:pt-32 pb-16 w-full max-w-7xl px-4">
      {/* HEADER */}
      <div className="mb-12 flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white transition-colors duration-500 uppercase tracking-tighter">
          <span className="text-orange-500 font-mono text-sm mr-2">
            [ {totalRegister} ]
          </span>
          resultados encontrados
        </h1>
      </div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        {/* SIDEBAR */}
        <aside className="space-y-6 bg-white dark:bg-slate-900/50 rounded-xl p-6 shadow-sm border dark:border-slate-800 transition-all duration-500 self-start">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            Filtros Ativos
          </h2>

          {/* CATEGORIA */}
          <div>
            <label className="block mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors duration-500">
              Categoria
            </label>
            <select
              {...register("categoryId")}
              className="w-full rounded-xl border border-gray-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 font-medium"
            >
              <option value="all">Todas</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* AUTOR */}
          <div>
            <label className="block mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors duration-500">
              Autor
            </label>
            <input
              type="text"
              placeholder="Nome do autor"
              {...register("author")}
              className="w-full rounded-xl border border-gray-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
            />
          </div>

          {/* PERÍODO */}
          <div>
            <label className="block mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors duration-500">
              Período
            </label>
            <div className="flex flex-col gap-3">
              <input
                type="date"
                {...register("startDate")}
                className="rounded-xl border border-gray-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 font-medium"
              />
              <input
                type="date"
                {...register("endDate")}
                className="rounded-xl border border-gray-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 font-medium"
              />
            </div>
          </div>
        </aside>

        {/* RESULTADOS */}
        <div className="space-y-4">
          {/* BUSCA */}
          <input
            type="text"
            placeholder="Buscar por título..."
            {...register("title")}
            className="w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xl shadow-slate-200/20 dark:shadow-none transition-all duration-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-bold"
          />

          {/* LISTA */}
          {visiblePosts.map((post) => (
            <Link
              to={`/noticias/${post.slug}`}
              key={post.id}
              className="block rounded-3xl border-2 border-slate-100 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/40 p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-orange-500/30 transition-all duration-700 group relative overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 cursor-pointer transition-colors duration-300 leading-tight tracking-tight uppercase">
                {post.title}
              </h2>
              <div className="mt-3 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex flex-wrap gap-4 transition-colors duration-500">
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                  {formatDateTime(post.createdAt)}
                </span>
                {post.author && (
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/30"></div>
                    BY: {post.author.name}
                  </span>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-[9px] uppercase font-black tracking-[0.2em]">
                {Array.isArray(post.category) ? (
                  post.category.map((c) => (
                    <span
                      key={c.id}
                      className="text-orange-600 dark:text-orange-400 bg-orange-500/5 dark:bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/10 transition-colors duration-500"
                    >
                      # {c.name}
                    </span>
                  ))
                ) : post.category ? (
                  <span className="text-orange-600 dark:text-orange-400 bg-orange-500/5 dark:bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/10 transition-colors duration-500">
                    # {post.category.name}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}

          {/* LOADING */}
          {loading && <LoadingPage />}

          {/* VER MAIS */}
          {currentPage + 1 < totalPage && (
            <div className="flex justify-center pt-6">
              <button
                onClick={() =>
                  loadPosts(registerForPage, currentPage + 1, true)
                }
                className="rounded-2xl bg-orange-600 hover:bg-orange-500 px-10 py-5 text-sm font-black text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-orange-900/10 uppercase tracking-widest"
              >
                {loading ? "CONFIGURING_DATA..." : "LOAD_MORE_NEWS"}
              </button>
            </div>
          )}

          {/* EMPTY */}
          {!loading && visiblePosts.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500">
              Nenhum resultado encontrado
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
