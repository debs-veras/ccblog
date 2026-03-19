import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiDocumentText, HiPlus, HiEye, HiXCircle } from "react-icons/hi";
import EmptyState from "../../../components/EmptyState";
import Table from "../../../components/UI/Table";
import Button from "../../../components/UI/Button";
import TableRowActions from "../../../components/UI/TableRowActions";
import AlertConfirm from "../../../components/UI/AlertConfirm";
import useToastLoading from "../../../hooks/useToastLoading";
import { useStorage } from "../../../hooks/storage";
import useDebounce from "../../../hooks/useDebounce";
import {
  deletePost,
  getAllPosts,
  publishPost,
} from "../../../services/post.service";
import { getCategories } from "../../../services/category.service";
import { formatDateName } from "../../../utils/formatar";
import type { Post, SearchPostParams } from "../../../types/post";
import type { Category } from "../../../types/category";
import Box, { BoxContainer } from "../../../components/UI/Box";
import { InputSelect, InputText } from "../../../components/UI/Input";
import { useForm } from "react-hook-form";
import PageTable from "../../../components/UI/Pagination";

type PostFiltersForm = Omit<SearchPostParams, "published"> & {
  published?: boolean | "" | "true" | "false";
};

export default function PostAllListing() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const [posts, setPosts] = useState<Post[]>([]);
  const {
    register,
    watch,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<PostFiltersForm>();
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRegister, setTotalRegister] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const registerForPage = 10;
  const recordsPerPage = 2;
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    post?: Post;
  }>({ show: false });

  const [publishModal, setPublishModal] = useState<{
    show: boolean;
    post?: Post;
  }>({ show: false });

  const user = useStorage().getUser();

  const publishedOptions = [
    { value: "", label: "Todos" },
    { value: "true", label: "Publicado" },
    { value: "false", label: "Rascunho" },
  ];

  const parsePublishedFilter = (
    published?: PostFiltersForm["published"],
  ): boolean | undefined => {
    if (published === "" || published === undefined) return undefined;
    if (published === true || published === "true") return true;
    if (published === false || published === "false") return false;
    return undefined;
  };

  const loadPosts = async (
    pageSize: number = registerForPage,
    page: number = 0,
  ) => {
    if (!user?.id) return;

    setLoading(true);

    let filters: SearchPostParams = { page: page + 1, limit: pageSize };

    await handleSubmit(async (dataForm) => {
      filters = {
        ...filters,
        title: dataForm.title,
        categoryId: dataForm.categoryId,
        startDate: dataForm.startDate,
        endDate: dataForm.endDate,
        published: parsePublishedFilter(dataForm.published),
        author: dataForm.author,
      };
    })();

    const response = await getAllPosts(filters);

    if (response.success && response.data) {
      const page = response.data.pagination;
      setCurrentPage(page.page - 1);
      setTotalRegister(page.total);
      setTotalPage(page.totalPages);
    } else
      toast({
        mensagem: response.message,
        tipo: response.type,
      });
    setPosts(response?.data?.data || []);
    setLoading(false);
  };

  const debouncedLoadPosts = useDebounce(loadPosts, 500);

  const handleDelete = async () => {
    if (!deleteModal.post) return;
    setLoading(true);
    toast({ mensagem: "Removendo dados.." });
    const response = await deletePost(deleteModal.post.id);
    setLoading(false);
    debouncedLoadPosts();
    toast({
      mensagem: response.message,
      tipo: response.type,
    });
    setDeleteModal({ show: false });
  };

  const handlePublish = async () => {
    const post = publishModal.post;
    if (!post || publishingId === post.id) return;
    setPublishingId(post.id);
    setLoading(true);
    toast({ mensagem: "Realizando ação..." });
    const response = await publishPost(post.id);
    setLoading(false);
    toast({
      mensagem: response.message,
      tipo: response.type,
    });
    debouncedLoadPosts();
    setPublishingId(null);
    setPublishModal({ show: false });
  };

  const handleClearFilters = () => {
    reset({
      title: "",
      categoryId: "",
      author: "",
      startDate: "",
      endDate: "",
      published: "",
    });
    setCurrentPage(0);
    loadPosts(registerForPage, 0);
  };

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      const response = await getCategories();
      if (response.success && response.data) setCategories(response.data);
      setLoadingCategories(false);
    };

    loadCategories();
    debouncedLoadPosts();
  }, []);

  useEffect(() => {
    const subscription = watch(() => debouncedLoadPosts());
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BoxContainer>
      <Box>
        <Box.Header>
          <Box.Header.Content>
            <Box.Header.Content.Titulo>Filtros</Box.Header.Content.Titulo>
          </Box.Header.Content>
        </Box.Header>
        <form className="lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid gap-4">
          <InputText
            name="title"
            size="sm"
            placeholder="Título do post"
            required={false}
            label="Título"
            register={register}
            disabled={isSubmitting}
          />
          <InputText
            name="author"
            size="sm"
            placeholder="Nome do autor"
            required={false}
            label="Autor"
            register={register}
            disabled={isSubmitting}
          />
          <InputSelect
            control={control}
            name="categoryId"
            label="Categoria"
            required={false}
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
            defaultOptionLabel="Todas"
            placeholder="Selecione uma categoria"
            disabled={isSubmitting || loadingCategories}
          />
          <InputSelect
            control={control}
            name="published"
            label="Status"
            required={false}
            options={publishedOptions}
            defaultOptionLabel="Todos"
            placeholder="Selecione o status"
            disabled={isSubmitting}
          />
          <div className="flex col-span-3 gap-4">
            <InputText
              name="startDate"
              size="sm"
              placeholder="Data inicial"
              required={false}
              label="Data inicial"
              register={register}
              disabled={isSubmitting}
              type="date"
            />
            <InputText
              name="endDate"
              size="sm"
              placeholder="Data final"
              required={false}
              label="Data final"
              register={register}
              disabled={isSubmitting}
              type="date"
            />
          </div>
          <div className=" flex items-end gap-2 justify-end">
            <Button
              model="button"
              type="print"
              text="Limpar filtros"
              onClick={handleClearFilters}
              disabled={isSubmitting || loading}
            />
          </div>
        </form>
      </Box>
      <Box loading={loading}>
        {posts.length === 0 && !loading ? (
          <EmptyState
            title="Nenhum post encontrado"
            description="Você ainda não criou nenhum post. Comece agora!"
            actionLabel="Novo Post"
            actionTo="/post/form"
            icon={
              <HiDocumentText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            }
          />
        ) : (
          <>
            <Table
              densidade="compacta"
              titulo=""
              botoes={
                <Button
                  model="button"
                  type="info"
                  icon={<HiPlus className="w-5 h-5" />}
                  text="Novo Post"
                  onClick={() => navigate("/post/form")}
                />
              }
            >
              <Table.Header>
                <Table.Header.Coluna>Titulo</Table.Header.Coluna>
                <Table.Header.Coluna>Slug</Table.Header.Coluna>
                <Table.Header.Coluna>Categoria</Table.Header.Coluna>
                <Table.Header.Coluna>Visualizacoes</Table.Header.Coluna>
                <Table.Header.Coluna>Status</Table.Header.Coluna>
                <Table.Header.Coluna>Criado em</Table.Header.Coluna>
                <Table.Header.Coluna>Atualizado em</Table.Header.Coluna>
                <Table.Header.Coluna alignText="text-right">
                  Acoes
                </Table.Header.Coluna>
              </Table.Header>
              <Table.Body>
                {posts.map((post) => (
                  <Table.Body.Linha key={post.id}>
                    <Table.Body.Linha.Coluna>
                      {post.title}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      /{post.slug}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {post.category?.name || "-"}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      <div className="flex items-center gap-2">
                        <HiEye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.published
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {post.published ? "Publicado" : "Rascunho"}
                      </span>
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {formatDateName(post.createdAt)}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {formatDateName(post.updatedAt) ?? "-"}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna alignText="text-right">
                      <TableRowActions
                        actions={{
                          publish: {
                            onClick: () =>
                              setPublishModal({ show: true, post }),
                            title: post.published
                              ? "Despublicar post"
                              : "Publicar post",
                            icon: post.published ? (
                              <HiXCircle className="w-5 h-5" />
                            ) : undefined,
                            className: post.published
                              ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                              : undefined,
                            disabled: publishingId === post.id,
                          },
                          edit: {
                            onClick: () => navigate(`/post/form/${post.id}`),
                          },
                          delete: {
                            onClick: () => setDeleteModal({ show: true, post }),
                          },
                        }}
                      />
                    </Table.Body.Linha.Coluna>
                  </Table.Body.Linha>
                ))}
              </Table.Body>
            </Table>
            {posts.length > 0 && (
              <PageTable
                loading={isSubmitting}
                page={currentPage}
                totalRecords={totalRegister}
                totalPages={totalPage}
                recordsPerPage={recordsPerPage}
                onClickPrevPage={() => {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  loadPosts(registerForPage, newPage);
                }}
                onClickPageNext={() => {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  loadPosts(registerForPage, newPage);
                }}
                onClickPage={(pagina) => {
                  setCurrentPage(pagina);
                  loadPosts(registerForPage, pagina);
                }}
                className="mt-4"
              />
            )}
          </>
        )}
      </Box>
      <AlertConfirm
        open={deleteModal.show}
        onOpenChange={(open) =>
          setDeleteModal(open ? deleteModal : { show: false })
        }
        onConfirm={handleDelete}
        title="Excluir Post"
        description={
          <>
            Tem certeza que deseja excluir o post "{deleteModal.post?.title}"?
          </>
        }
        type="error"
      />
      <AlertConfirm
        open={publishModal.show}
        onOpenChange={(open) =>
          setPublishModal(open ? publishModal : { show: false })
        }
        onConfirm={handlePublish}
        title={
          publishModal.post?.published ? "Despublicar Post" : "Publicar Post"
        }
        description={
          <>
            {publishModal.post?.published
              ? "Tem certeza que deseja despublicar o post "
              : "Tem certeza que deseja publicar o post "}
            {publishModal.post?.title}"?
          </>
        }
        confirmText={publishModal.post?.published ? "Despublicar" : "Publicar"}
        type={publishModal.post?.published ? "error" : "info"}
      />
    </BoxContainer>
  );
}
