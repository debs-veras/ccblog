import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiDocumentText, HiPlus } from "react-icons/hi";
import EmptyState from "../../../components/EmptyState";
import Table from "../../../components/UI/Table";
import Button from "../../../components/UI/Button";
import TableRowActions from "../../../components/UI/TableRowActions";
import AlertConfirm from "../../../components/UI/AlertConfirm";
import useToastLoading from "../../../hooks/useToastLoading";
import { useStorage } from "../../../hooks/storage";
import useDebounce from "../../../hooks/useDebounce";
import { formatDateName } from "../../../utils/formatar";
import Box, { BoxContainer } from "../../../components/UI/Box";
import { InputSelect, InputText } from "../../../components/UI/Input";
import { useForm } from "react-hook-form";
import PageTable from "../../../components/UI/Pagination";
import type { SearchUserParams, User } from "../../../types/user";
import { deleteUser, getAllUsers } from "../../../services/user.service";

type UserFiltersForm = Omit<SearchUserParams, "role"> & {
  role?: "ADMIN" | "AUTHOR" | "";
};

export default function UserListing() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const [users, setUsers] = useState<User[]>([]);
  const {
    register,
    watch,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<UserFiltersForm>();

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRegister, setTotalRegister] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const registerForPage = 10;
  const recordsPerPage = 2;

  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    user?: User;
  }>({ show: false });

  const user = useStorage().getUser();

  const roleptions = [
    { value: "", label: "Todos" },
    { value: "ADMIN", label: "Admin" },
    { value: "AUTHOR", label: "Autor" },
  ];

  const loadPosts = async (
    pageSize: number = registerForPage,
    page: number = 0,
  ) => {
    if (!user?.id) return;

    setLoading(true);

    let filters: SearchUserParams = { page: page + 1, limit: pageSize };

    await handleSubmit(async (dataForm) => {
      filters = {
        ...filters,
        email: dataForm.email,
        name: dataForm.name,
        role: dataForm.role as "ADMIN" | "AUTHOR" | undefined,
      };
    })();

    const response = await getAllUsers(filters);
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
    setUsers(response?.data?.data || []);
    setLoading(false);
  };

  const debouncedLoadPosts = useDebounce(loadPosts, 500);

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setLoading(true);
    toast({ mensagem: "Removendo dados.." });
    const response = await deleteUser(deleteModal.user.id);
    setLoading(false);
    debouncedLoadPosts();
    toast({
      mensagem: response.message,
      tipo: response.type,
    });
    setDeleteModal({ show: false });
  };

  const handleClearFilters = () => {
    reset({
      email: "",
      name: "",
      role: "",
    });
    setCurrentPage(0);
  };

  useEffect(() => {
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
            name="name"
            size="sm"
            placeholder="Nome do usuário"
            required={false}
            label="Nome"
            register={register}
            disabled={isSubmitting}
          />
          <InputText
            name="email"
            size="sm"
            placeholder="Email do usuário"
            required={false}
            label="Autor"
            register={register}
            disabled={isSubmitting}
          />
          <InputSelect
            control={control}
            name="role"
            label="Cargo"
            required={false}
            options={roleptions}
            defaultOptionLabel="Todos"
            placeholder="Selecione o cargo"
            disabled={isSubmitting}
          />

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
        {users.length === 0 && !loading ? (
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
                  text="Novo Usuário"
                  onClick={() => navigate("/user/form")}
                />
              }
            >
              <Table.Header>
                <Table.Header.Coluna>Nome</Table.Header.Coluna>
                <Table.Header.Coluna>Email</Table.Header.Coluna>
                <Table.Header.Coluna>Role</Table.Header.Coluna>
                <Table.Header.Coluna>Data de criação</Table.Header.Coluna>
                <Table.Header.Coluna>Data de atualização</Table.Header.Coluna>
                <Table.Header.Coluna alignText="text-right">
                  Acoes
                </Table.Header.Coluna>
              </Table.Header>
              <Table.Body>
                {users.map((user) => (
                  <Table.Body.Linha key={user.id}>
                    <Table.Body.Linha.Coluna>
                      {user.name}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {user.email}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {user.role || "-"}
                    </Table.Body.Linha.Coluna>

                    <Table.Body.Linha.Coluna>
                      {formatDateName(user.createdAt)}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {formatDateName(user.updatedAt) ?? "-"}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna alignText="text-right">
                      <TableRowActions
                        actions={{
                          edit: {
                            onClick: () => navigate(`/user/form/${user.id}`),
                          },
                          delete: {
                            onClick: () =>
                              setDeleteModal({ show: true, user: user }),
                          },
                        }}
                      />
                    </Table.Body.Linha.Coluna>
                  </Table.Body.Linha>
                ))}
              </Table.Body>
            </Table>
            {users.length > 0 && (
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
        title="Excluir Usuário"
        description={
          <>Tem certeza que deseja excluir o usuário "{deleteModal.user?.name}"?</>
        }
        type="error"
      />
    </BoxContainer>
  );
}
