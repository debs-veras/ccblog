import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useToastLoading from "../../../hooks/useToastLoading";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputQuill, InputSelect, InputText } from "../../../components/UI/Input";
import Button from "../../../components/UI/Button";
import {
  createPost,
  getPostById,
  updatePost,
} from "../../../services/post.service";
import { getCategories } from "../../../services/category.service";
import { HiPencil, HiTag, HiFolder, HiDocumentText } from "react-icons/hi";
import { useStorage } from "../../../hooks/storage";
import type { CreatePostInput } from "../../../types/post";
import { postSchema } from "../../../schemas/post";
import type { Category } from "../../../types/category";
import Box from "../../../components/UI/Box";

type PostFormType = z.infer<typeof postSchema>;

export default function PostForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToastLoading();
  const user = useStorage().getUser();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostFormType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      categoryId: "",
    },
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const titleValue = watch("title");

  const loadPost = async () => {
    const response = await getPostById(id!);
    if (response.success && response.data) {
      setValue("title", response.data.title);
      setValue("slug", response.data.slug);
      setValue("description", response.data.description || "");
      setValue("content", response.data.content);
      setValue("categoryId", response.data.categoryId || "");
    } else {
      toast({ mensagem: response.message, tipo: response.type });
      reset();
      navigate("/posts");
    }
  };

  const loadCategories = async () => {
    const response = await getCategories();
    if (!response.success) {
      toast({ mensagem: response.message, tipo: response.type });
      navigate("/posts");
    }
    setCategories(response.data || []);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const onSubmit = async (data: PostFormType) => {
    if (!user) {
      toast({ mensagem: "Usuário não autenticado.", tipo: "error" });
      return;
    }

    const postData: CreatePostInput = {
      ...data,
      authorId: user.id,
    };

    if (!postData.categoryId) delete postData.categoryId;

    const response = isEdit
      ? await updatePost(id!, postData)
      : await createPost(postData);

    toast({ mensagem: response.message, tipo: response.type });
    navigate("/meus-posts");
  };

  useEffect(() => {
    setValue("slug", generateSlug(titleValue || ""));
  }, [titleValue, setValue]);

  useEffect(() => {
    loadCategories();
    if (isEdit) loadPost();
  }, [id, isEdit]);

  return (
    <Box loading={isEdit && isSubmitting}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 space-y-6"
        encType="multipart/form-data"
      >
        <InputText
          name="title"
          label="Título do Post"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          placeholder="Digite o título do post"
          icon={<HiPencil className="w-5 h-5 text-neutral-400" />}
        />
        <InputText
          name="slug"
          label="Slug (URL amigável)"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          placeholder="titulo-do-post"
          icon={<HiTag className="w-5 h-5 text-neutral-400" />}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          O slug é gerado automaticamente do título, mas você pode editá-lo
        </p>
        <InputText
          name="description"
          label="Descrição do Post"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          placeholder="Resumo breve do conteúdo"
          required={false}
          icon={<HiDocumentText className="w-5 h-5 text-neutral-400" />}
        />
        <div className="flex flex-col gap-1 w-full">
          <div className="relative group w-full">
            <InputSelect
              control={control}
              name="categoryId"
              label=" Categoria (Opcional)"
              errors={errors}
              disabled={isSubmitting}
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              placeholder="Selecione uma categoria"
              defaultOptionLabel="Selecione uma categoria"
              required={false}
              icon={<HiFolder className="w-5 h-5 text-neutral-400" />}
            />
          </div>
          <p className="mt-2 text-sm text-neutral-500">
            Escolha uma categoria para organizar seu post
          </p>
        </div>
        <InputQuill
          name="content"
          control={control}
          label="Conteúdo"
          errors={errors}
          disabled={isSubmitting}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="print"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            text="voltar"
            model="button"
          />
          <Button
            type="info"
            loading={isSubmitting}
            disabled={isSubmitting}
            text={
              isSubmitting ? "Salvando..." : isEdit ? "Atualizar" : "Criar Post"
            }
            model="submit"
          />
        </div>
      </form>
    </Box>
  );
}
