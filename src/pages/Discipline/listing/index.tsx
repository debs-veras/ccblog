import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiPlus, HiBookOpen } from "react-icons/hi";
import EmptyState from "../../../components/EmptyState";
import Table from "../../../components/UI/Table";
import Button from "../../../components/UI/Button";
import TableRowActions from "../../../components/UI/TableRowActions";
import AlertConfirm from "../../../components/UI/AlertConfirm";
import useToastLoading from "../../../hooks/useToastLoading";
import useDebounce from "../../../hooks/useDebounce";
import {
  listDisciplines,
  deleteDiscipline,
} from "../../../services/discipline.service";
import type {
  Discipline,
  SearchDisciplineParams,
} from "../../../types/discipline";
import Box, { BoxContainer } from "../../../components/UI/Box";
import { InputText, InputSelect } from "../../../components/UI/Input";
import { useForm } from "react-hook-form";
import PageTable from "../../../components/UI/Pagination";

type DisciplineFiltersForm = {
  name?: string;
  code?: string;
  period?: string;
};

export default function DisciplineListing() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const {
    register,
    watch,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<DisciplineFiltersForm>();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRegister, setTotalRegister] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const registerForPage = 10;

  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    discipline?: Discipline;
  }>({ show: false });

  const loadDisciplines = async (
    pageSize: number = registerForPage,
    page: number = 0,
  ) => {
    setLoading(true);

    let filters: SearchDisciplineParams = { page: page + 1, limit: pageSize };

    await handleSubmit(async (dataForm) => {
      filters = {
        ...filters,
        name: dataForm.name,
        code: dataForm.code,
        period: Number(dataForm.period),
      };
    })();

    const response = await listDisciplines(filters);

    if (response.success && response.data) {
      setDisciplines(response.data.data);
      setCurrentPage(response.data.pagination.page - 1);
      setTotalRegister(response.data.pagination.total);
      setTotalPage(response.data.pagination.totalPages);
    } else {
      toast({
        mensagem: response.message,
        tipo: response.type,
      });
    }
    setLoading(false);
  };

  const debouncedLoad = useDebounce(loadDisciplines, 500);

  const handleDelete = async () => {
    if (!deleteModal.discipline) return;
    setLoading(true);
    const response = await deleteDiscipline(deleteModal.discipline.id);
    setLoading(false);
    loadDisciplines();
    toast({
      mensagem: response.message,
      tipo: response.type,
    });
    setDeleteModal({ show: false });
  };

  const handleClearFilters = () => {
    reset({
      name: "",
      code: "",
      period: "",
    });
    loadDisciplines();
  };

  useEffect(() => {
    loadDisciplines();
  }, []);

  useEffect(() => {
    const subscription = watch(() => debouncedLoad());
    return () => subscription.unsubscribe();
  }, [watch]);

  const periodOptions = [
    ...Array.from({ length: 9 }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1}º Período`,
    })),
    { value: "0", label: "Optativa" },
  ];

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
            placeholder="Nome da disciplina"
            required={false}
            label="Nome"
            register={register}
            disabled={isSubmitting}
          />
          <InputText
            name="code"
            size="sm"
            placeholder="Código"
            required={false}
            label="Código"
            register={register}
            disabled={isSubmitting}
          />
          <InputSelect
            control={control}
            name="period"
            label="Período"
            size="sm"
            required={false}
            options={periodOptions}
            defaultOptionLabel="Todos"
            placeholder="Selecione o período"
            disabled={isSubmitting}
          />
          <div className="flex items-end gap-2 justify-end">
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

      <Box loading={loading || isSubmitting}>
        {disciplines.length === 0 && !loading ? (
          <EmptyState
            title="Nenhuma disciplina encontrada"
            description="Comece criando sua primeira disciplina para o curso."
            actionLabel="Nova Disciplina"
            actionTo="/disciplina/form"
            icon={
              <HiBookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
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
                  text="Nova Disciplina"
                  onClick={() => navigate("/disciplina/form")}
                />
              }
            >
              <Table.Header>
                <Table.Header.Coluna>Código</Table.Header.Coluna>
                <Table.Header.Coluna>Nome</Table.Header.Coluna>
                <Table.Header.Coluna>Período</Table.Header.Coluna>
                <Table.Header.Coluna>Carga Horária</Table.Header.Coluna>
                <Table.Header.Coluna alignText="text-right">
                  Ações
                </Table.Header.Coluna>
              </Table.Header>
              <Table.Body>
                {disciplines.map((d) => (
                  <Table.Body.Linha key={d.id}>
                    <Table.Body.Linha.Coluna>{d.code}</Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>{d.name}</Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {d.period === 0 ? "Optativa" : `${d.period}º`}
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna>
                      {d.workload}h
                    </Table.Body.Linha.Coluna>
                    <Table.Body.Linha.Coluna alignText="text-right">
                      <TableRowActions
                        actions={{
                          edit: {
                            onClick: () => navigate(`/disciplina/form/${d.id}`),
                          },
                          delete: {
                            onClick: () =>
                              setDeleteModal({ show: true, discipline: d }),
                          },
                        }}
                      />
                    </Table.Body.Linha.Coluna>
                  </Table.Body.Linha>
                ))}
              </Table.Body>
            </Table>
            {totalPage > 1 && (
              <PageTable
                loading={isSubmitting}
                page={currentPage}
                totalRecords={totalRegister}
                totalPages={totalPage}
                recordsPerPage={registerForPage}
                onClickPrevPage={() => setCurrentPage((p) => p - 1)}
                onClickPageNext={() => setCurrentPage((p) => p + 1)}
                onClickPage={(p) => setCurrentPage(p)}
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
        title="Excluir Disciplina"
        description={
          <>
            Tem certeza que deseja excluir a disciplina "
            {deleteModal.discipline?.name}"? Essa ação não pode ser desfeita.
          </>
        }
        type="error"
      />
    </BoxContainer>
  );
}
