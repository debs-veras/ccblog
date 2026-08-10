import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiKey, HiUser, HiMail, HiShieldCheck, HiSave, HiCamera, HiUpload } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { FaSpinner } from "react-icons/fa";
import { useState, useRef } from "react";
import { changePasswordSchema } from "@/schemas/auth";
import useToastLoading from "@/hooks/useToastLoading";
import useUserStore from "@/stores/useUserStore";
import { changePassword, logout } from "@/services/auth.service";
import { updateProfile } from "@/services/user.service";
import { uploadImage } from "@/services/upload.service";
import { InputPassword } from "@/components/Input";
import Box from "@/components/Box";
import Button from "@/components/Button";
import { getRoleLabel } from "@/utils/roles";
import ImageCropperModal from "@/components/ImageCropperModal";

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const navigate = useNavigate();
  const toast = useToastLoading();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const isGoogleUser = Boolean(user?.googleId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para Perfil (Nome e Foto)
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(user?.avatarUrl || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Estado do Cropper
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  // Selecionar arquivo e abrir o Cropper
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Enviar a imagem cortada para o Cloudinary
  const handleCropComplete = async (croppedFile: File) => {
    try {
      setIsCropperOpen(false);
      setIsUploadingImage(true);
      const response = await uploadImage(croppedFile);
      if (response.success && response.data?.url) setProfileAvatarUrl(response.data.url);
      else toast({ mensagem: response.message || "Erro ao enviar imagem", tipo: "error" });
    } catch (err: any) {
      toast({ mensagem: err?.message || "Ocorreu um erro no envio da imagem", tipo: "error" });
    } finally {
      setIsUploadingImage(false);
      setRawImageSrc(null);
    }
  };

  // Form de Alteração de Senha (para contas tradicionais)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isSubmittingPassword },
    reset,
  } = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast({ mensagem: "O nome não pode ficar em branco", tipo: "error" });
      return;
    }

    try {
      setIsSavingProfile(true);
      const res = await updateProfile({
        name: profileName.trim(),
        avatarUrl: profileAvatarUrl.trim() || undefined,
      });

      if (res.success && res.data) {
        setUser({
          ...user!,
          name: res.data.name,
          avatarUrl: res.data.avatarUrl,
        });
        toast({ mensagem: "Perfil atualizado com sucesso!", tipo: "success" });
      } else
        toast({ mensagem: res.message || "Erro ao atualizar perfil", tipo: res.type || "error" });
    } catch (err: any) {
      toast({ mensagem: err?.message || "Erro ao salvar perfil", tipo: "error" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const onSubmitPassword = async (data: ChangePasswordType) => {
    const response = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      email: user?.email ?? "",
    });

    if (response.success) {
      toast({
        mensagem: "Senha alterada com sucesso! Faça login novamente com a nova senha.",
        tipo: "success",
      });
      reset();

      // Realizar logout completo e redirecionar para login
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      useUserStore.getState().logout();
      navigate("/login");
    } else toast({ mensagem: response.message, tipo: response.type });
  };

  return (
    <div className="space-y-8">
      {/* SEÇÃO 1: PERFIL DO USUÁRIO */}
      <Box loading={isSavingProfile}>
        <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <HiUser className="w-5 h-5 text-orange-500" />
              Perfil do Usuário
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Atualize suas informações pessoais e foto de perfil.
            </p>
          </div>

          <span className="text-xs font-semibold uppercase px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
            {getRoleLabel(user?.role)}
          </span>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* FOTO E UPLOAD */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700">
            <div className="relative group shrink-0">
              {profileAvatarUrl ? (
                <img
                  src={profileAvatarUrl}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-orange-500 shadow-md"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    toast({
                      mensagem: "Foto de perfil indisponível ou URL inválida",
                      tipo: "error",
                    });
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-[#ff7a00] to-[#ff9d42] text-white font-black text-3xl flex items-center justify-center shadow-md">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              {/* OVERLAY DE CÂMERA AO PASSAR O MOUSE */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="absolute inset-0 rounded-full bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs cursor-pointer"
                title="Escolher foto do seu dispositivo"
              >
                {isUploadingImage ? (
                  <FaSpinner className="w-6 h-6 animate-spin text-white" />
                ) : (
                  <>
                    <HiCamera className="w-6 h-6" />
                    <span className="text-[10px] font-bold mt-0.5">Alterar</span>
                  </>
                )}
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="flex-1 w-full space-y-3 text-center sm:text-left">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  Foto do Perfil
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Selecione uma imagem do seu computador ou celular para salvar no perfil.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white border border-orange-600 text-xs font-bold transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {isUploadingImage ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Enviando foto...
                    </>
                  ) : (
                    <>
                      <HiUpload className="w-4 h-4" />
                      Escolher Foto do Dispositivo
                    </>
                  )}
                </button>

                {profileAvatarUrl && (
                  <button
                    type="button"
                    onClick={() => setProfileAvatarUrl("")}
                    className="text-xs text-red-500 hover:text-red-600 font-semibold underline cursor-pointer"
                  >
                    Remover foto
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NOME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  placeholder="Seu Nome"
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-700 pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* E-MAIL (SOMENTE LEITURA) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                E-mail (Somente leitura)
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-800 pl-10 pr-4 py-2.5 text-sm bg-gray-100 dark:bg-slate-800/50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 text-sm shadow-md transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              <HiSave className="w-4 h-4" />
              {isSavingProfile ? "Salvando Perfil..." : "Salvar Alterações do Perfil"}
            </button>
          </div>
        </form>
      </Box>

      {/* SEÇÃO 2: SEGURANÇA E SENHA */}
      <Box loading={isSubmittingPassword}>
        <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <HiShieldCheck className="w-5 h-5 text-orange-500" />
            Segurança da Conta
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Gerencie as credenciais e acessos da sua conta.
          </p>
        </div>

        {isGoogleUser ? (
          /* CONTA GOOGLE: NÃO EXIBIR FORM DE ALTERAÇÃO DE SENHA */
          <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 shadow-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm shrink-0">
              <FcGoogle className="w-8 h-8" />
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h4 className="text-sm font-bold text-sky-950 dark:text-sky-200">
                Autenticação via Google Ativa
              </h4>
              <p className="text-xs text-sky-700 dark:text-sky-300 leading-relaxed">
                Sua conta está conectada usando o **Google Sign-In**. A alteração de senha não se
                aplica a este tipo de acesso e deve ser realizada diretamente nas configurações da
                sua Conta do Google.
              </p>
            </div>
          </div>
        ) : (
          /* CONTA TRADICIONAL: EXIBIR FORM DE SENHA */
          <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-6">
            <InputPassword
              name="currentPassword"
              label="Senha Atual"
              type="password"
              register={register}
              errors={errors}
              disabled={isSubmittingPassword}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputPassword
                name="newPassword"
                label="Nova Senha"
                type="password"
                register={register}
                errors={errors}
                disabled={isSubmittingPassword}
                icon={<HiKey className="w-5 h-5 text-neutral-400" />}
              />

              <InputPassword
                name="confirmPassword"
                label="Confirmar Nova Senha"
                type="password"
                register={register}
                errors={errors}
                disabled={isSubmittingPassword}
                icon={<HiKey className="w-5 h-5 text-neutral-400" />}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="print"
                onClick={() => navigate(-1)}
                disabled={isSubmittingPassword}
                text="Voltar"
                model="button"
              />

              <Button
                type="info"
                loading={isSubmittingPassword}
                disabled={isSubmittingPassword}
                text={isSubmittingPassword ? "Salvando..." : "Alterar Senha"}
                model="submit"
              />
            </div>
          </form>
        )}
      </Box>

      {/* MODAL INTERATIVO DE RECORTE DE IMAGEM */}
      {isCropperOpen && rawImageSrc && (
        <ImageCropperModal
          imageSrc={rawImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setIsCropperOpen(false);
            setRawImageSrc(null);
          }}
        />
      )}
    </div>
  );
}
