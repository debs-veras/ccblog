import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiPlus, HiDocumentText } from "react-icons/hi";
import AlertConfirm from "../../../components/UI/AlertConfirm";
import {
  getCategories,
  deleteCategory,
} from "../../../services/category.service";
import useToastLoading from "../../../hooks/useToastLoading";
import EmptyState from "../../../components/EmptyState";

import Table from "../../../components/UI/Table";
import Button from "../../../components/UI/Button";
import TableRowActions from "../../../components/UI/TableRowActions";
import type { Category } from "../../../types/category";
import Box, { BoxContainer } from "../../../components/UI/Box";

export default function CategoriesListing() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    show: boolean;
    category?: Category;
  }>({ show: false });
  const toast = useToastLoading();
  const navigate = useNavigate();

  const loadCategories = async () => {
    setLoading(true);
    const response = await getCategories();
    if (!response.success) {
      toast({
        mensagem: response.message,
        tipo: response.type,
      });
    }
    setCategories(response.data || []);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteModal.category) return;
    const response = await deleteCategory(deleteModal.category.id);
    loadCategories();
    setDeleteModal({ show: false });
    toast({
      mensagem: response?.message,
      tipo: response?.type,
    });
  };

  useEffect(() => {
    (async () => {
      await loadCategories();
    })();
  }, []);

  return (
    <BoxContainer>
      <Box loading={loading}>
        {!categories.length && !loading ? (
          <EmptyState
            title="Nenhuma categoria encontrada"
            description="Comece criando sua primeira categoria"
            actionLabel="Nova Categoria"
            actionTo="/categoria/form"
          />
        ) : (
          <Table
            densidade="compacta"
            titulo=""
            botoes={
              <Button
                model="button"
                type="info"
                icon={<HiPlus className="w-5 h-5" />}
                text="Nova Categoria"
                onClick={() => navigate("/categoria/form")}
              />
            }
          >
            <Table.Header>
              <Table.Header.Coluna>#</Table.Header.Coluna>
              <Table.Header.Coluna>Nome</Table.Header.Coluna>
              <Table.Header.Coluna>Slug</Table.Header.Coluna>
              <Table.Header.Coluna>Descrição</Table.Header.Coluna>
              <Table.Header.Coluna>Posts</Table.Header.Coluna>
              <Table.Header.Coluna alignText="text-right">
                Ações
              </Table.Header.Coluna>
            </Table.Header>
            <Table.Body>
              {categories.map((category) => (
                <Table.Body.Linha key={category.id}>
                  <Table.Body.Linha.Coluna>
                    {category.id}
                  </Table.Body.Linha.Coluna>
                  <Table.Body.Linha.Coluna>
                    {category.name}
                  </Table.Body.Linha.Coluna>
                  <Table.Body.Linha.Coluna>
                    /{category.slug}
                  </Table.Body.Linha.Coluna>
                  <Table.Body.Linha.Coluna>
                    {category.description || "-"}
                  </Table.Body.Linha.Coluna>
                  <Table.Body.Linha.Coluna>
                    <div className="flex items-center gap-1">
                      <HiDocumentText className="w-4 h-4" />
                      <span>{category._count?.posts || 0}</span>
                    </div>
                  </Table.Body.Linha.Coluna>
                  <Table.Body.Linha.Coluna alignText="text-right">
                    <TableRowActions
                      actions={{
                        edit: {
                          onClick: () =>
                            navigate(`/categoria/form/${category.id}`),
                        },
                        delete: {
                          onClick: () =>
                            setDeleteModal({ show: true, category }),
                        },
                      }}
                    />
                  </Table.Body.Linha.Coluna>
                </Table.Body.Linha>
              ))}
            </Table.Body>
          </Table>
        )}
      </Box>
      <AlertConfirm
        open={deleteModal.show}
        onOpenChange={(open) =>
          setDeleteModal(open ? deleteModal : { show: false })
        }
        onConfirm={handleDelete}
        title="Excluir Categoria"
        description={
          <>
            Tem certeza que deseja excluir a categoria "
            {deleteModal.category?.name}"?
            {!!deleteModal.category?._count?.posts && (
              <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                Esta categoria possui {deleteModal.category._count.posts}{" "}
                post(s) associado(s).
              </span>
            )}
          </>
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        type="error"
      />
    </BoxContainer>
  );
}
