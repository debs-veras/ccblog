import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiLockClosed, HiKey } from "react-icons/hi";
import useToastLoading from "../../hooks/useToastLoading";
import { changePasswordSchema } from "../../schemas/auth";
import { InputPassword } from "../../components/UI/Input";
import Box from "../../components/UI/Box";
import Button from "../../components/UI/Button";
import { changePassword } from "../../services/auth.service";
import { useStorage } from "../../hooks/storage";

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const user = useStorage().getUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordType) => {
    const response = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      email: user?.email ?? "",
    });

    toast({ mensagem: response.message, tipo: response.type });

    if (response.success) {
      reset();
      navigate("/dashboard");
    }
  };

  return (
    <Box loading={isSubmitting}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 space-y-6"
      >
        <InputPassword
          name="currentPassword"
          label="Senha Atual"
          type="password"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          icon={<HiLockClosed className="w-5 h-5 text-neutral-400" />}
        />

        <InputPassword
          name="newPassword"
          label="Nova Senha"
          type="password"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          icon={<HiKey className="w-5 h-5 text-neutral-400" />}
        />

        <InputPassword
          name="confirmPassword"
          label="Confirmar Nova Senha"
          type="password"
          register={register}
          errors={errors}
          disabled={isSubmitting}
          icon={<HiKey className="w-5 h-5 text-neutral-400" />}
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
            text={isSubmitting ? "Salvando..." : "Alterar Senha"}
            model="submit"
          />
        </div>
      </form>
    </Box>
  );
}
