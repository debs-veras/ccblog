import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToastLoading from "../../../hooks/useToastLoading";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "../../../components/UI/Input";

import Button from "../../../components/UI/Button";
import {
  getCategory,
  createCategory,
  updateCategory,
} from "../../../services/category.service";
import Box from "../../../components/UI/Box";

const categorySchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  slug: z.string().min(2, "Slug obrigatório"),
  description: z.string().optional(),
});

type CategoryFormType = z.infer<typeof categorySchema>;

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToastLoading();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CategoryFormType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });
  const nameValue = watch("name");

  const loadCategory = async () => {
    const response = await getCategory(id!);
    if (response.success) {
      setValue("name", response.data?.name || "");
      setValue("slug", response.data?.slug || "");
      setValue("description", response.data?.description || "");
    } else {
      toast({
        mensagem: response.message,
        tipo: response.type,
      });
      reset();
      navigate("/categorias");
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const onSubmit = async (data: CategoryFormType) => {
    const response = isEdit
      ? await updateCategory(id!, data)
      : await createCategory(data);

    toast({
      mensagem: response.message,
      tipo: response.type,
    });

    navigate("/categorias");
  };

  useEffect(() => {
    setValue("slug", generateSlug(nameValue || ""));
  }, [nameValue, setValue]);

  useEffect(() => {
    if (isEdit) loadCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  return (
    <Box loading={isEdit && isSubmitting}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 space-y-6"
      >
        <InputText
          name="name"
          label="Nome da Categoria"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          placeholder="Ex: Tecnologia"
        />
        <InputText
          name="slug"
          label="Slug"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          placeholder="tecnologia"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          URL amigável para a categoria (gerado automaticamente)
        </p>
        <InputText
          name="description"
          label="Descrição"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          placeholder="Descrição opcional da categoria"
          type="text"
          required={false}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="print"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            text="Voltar"
            model="button"
          />
          <Button
            type="info"
            loading={isSubmitting}
            disabled={isSubmitting}
            text={
              isSubmitting
                ? "Salvando..."
                : isEdit
                  ? "Atualizar"
                  : "Criar Categoria"
            }
            model="submit"
          />
        </div>
      </form>
    </Box>
  );
}
