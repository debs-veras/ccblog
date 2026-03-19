import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import type { Post, SearchPostParams } from "../../types/post";
import { searchPosts } from "../../services/post.service";
import { getCategories } from "../../services/category.service";
import useToastLoading from "../../hooks/useToastLoading";
import useDebounce from "../../hooks/useDebounce";
import type { Category } from "../../types/category";
import LoadingPage from "../../components/LoadingPage";

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
    } else {
      toast({ mensagem: response.message, tipo: response.type });
    }

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
  }, []);

  useEffect(() => {
    const subscription = watch(() => {
      setVisiblePosts([]);
      debouncedSearch(registerForPage, 0, false);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <section className="mx-auto my-10 w-full max-w-7xl px-4">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {totalRegister} resultados encontrados
        </h1>
      </div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        {/* SIDEBAR */}
        <aside className="space-y-6 bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700">Filtros</h2>

          {/* CATEGORIA */}
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-500">
              Categoria
            </label>
            <select
              {...register("categoryId")}
              className="w-full rounded border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
            <label className="block mb-1 text-xs font-medium text-gray-500">
              Autor
            </label>
            <input
              type="text"
              placeholder="Nome do autor"
              {...register("author")}
              className="w-full rounded border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* PERÍODO */}
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-500">
              Período
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="date"
                {...register("startDate")}
                className="rounded border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <input
                type="date"
                {...register("endDate")}
                className="rounded border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />

          {/* LISTA */}
          {visiblePosts.map((post) => (
            <div
              key={post.id}
              className="rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h2 className="text-base font-semibold text-gray-800 hover:text-orange-500 cursor-pointer">
                {post.title}
              </h2>
              <div className="mt-1 text-xs text-gray-500 flex flex-wrap gap-2">
                <span>
                  {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                </span>
                {post.author && <span>• {post.author.name}</span>}
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
                {Array.isArray(post.category) ? (
                  post.category.map((c) => <span key={c.id}>#{c.name}</span>)
                ) : post.category ? (
                  <span>#{post.category.name}</span>
                ) : null}
              </div>
            </div>
          ))}

          {/* LOADING */}
          {loading && <LoadingPage />}

          {/* VER MAIS */}
          {currentPage + 1 < totalPage && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() =>
                  loadPosts(registerForPage, currentPage + 1, true)
                }
                className="rounded bg-orange-500 px-4 py-2 text-sm text-white hover:opacity-90 transition"
              >
                {loading ? "Carregando..." : "Ver mais"}
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
