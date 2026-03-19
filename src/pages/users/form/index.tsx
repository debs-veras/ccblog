import type z from "zod";
import Box from "../../../components/UI/Box";
import Button from "../../../components/UI/Button";
import {
  InputPassword,
  InputSelect,
  InputText,
} from "../../../components/UI/Input";
import { userSchema } from "../../../schemas/user";
import { useNavigate, useParams } from "react-router-dom";
import useToastLoading from "../../../hooks/useToastLoading";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUser,
  getUserById,
  updateUser,
} from "../../../services/user.service";
import { useEffect } from "react";
import type { CreateUserInput } from "../../../types/user";

type UserFormType = z.infer<typeof userSchema>;

const roleOptions = [
  { value: "TEACHER", label: "Professor" },
  { value: "ADMIN", label: "Administrador" },
  { value: "STUDENT", label: "Estudante" },
];

export default function UserForm() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const { id } = useParams();
  const isEdit = !!id;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
  });

  const loadPost = async () => {
    const response = await getUserById(id!);
    if (response.success && response.data) {
      setValue("name", response.data.name);
      setValue("email", response.data.email);
      setValue("role", response.data.role);
    } else {
      toast({ mensagem: response.message, tipo: response.type });
      reset();
      navigate("/users");
    }
  };

  const onSubmit = async (data: UserFormType) => {
    const userData: CreateUserInput = {
      ...data,
      password: data.password || "",
    };

    const response = isEdit
      ? await updateUser(id!, userData)
      : await createUser(userData);

    toast({ mensagem: response.message, tipo: response.type });

    if (response.success) {
      reset();
      navigate("/users");
    }
  };

  useEffect(() => {
    if (isEdit) loadPost();
  }, [id, isEdit]);

  return (
    <Box loading={isEdit && isSubmitting}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 space-y-6"
      >
        <InputText
          name="name"
          label="Nome"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          placeholder="Digite o nome"
        />

        <InputText
          name="email"
          label="Email"
          type="email"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          placeholder="Digite o email"
        />

        {!isEdit && (
          <>
            <InputPassword
              name="password"
              label="Senha"
              register={register}
              errors={errors}
              disabled={isSubmitting}
              placeholder="Digite a senha"
            />

            <InputPassword
              name="confirmPassword"
              label="Confirmar Senha"
              register={register}
              errors={errors}
              disabled={isSubmitting}
              placeholder="Confirme a senha"
            />
          </>
        )}

        <InputSelect
          control={control}
          name="role"
          label="Perfil"
          errors={errors}
          disabled={isSubmitting}
          options={roleOptions}
          defaultOptionLabel="Selecione um perfil"
          noNullOption
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
            text={isSubmitting ? "Salvando..." : "Cadastrar"}
            model="submit"
          />
        </div>
      </form>
    </Box>
  );
}
