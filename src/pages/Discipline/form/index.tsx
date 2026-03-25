import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { disciplineSchema } from "../../../schemas/discipline";
import Box from "../../../components/UI/Box";
import Button from "../../../components/UI/Button";
import { InputText, InputSelect } from "../../../components/UI/Input";
import { HiTrash } from "react-icons/hi";
import useToastLoading from "../../../hooks/useToastLoading";
import { useStorage } from "../../../hooks/storage";
import { getAllUsers } from "../../../services/user.service";
import {
  createDiscipline,
  getDisciplineById,
  listDisciplines,
  updateDiscipline,
} from "../../../services/discipline.service";
import type z from "zod";
import type { CreateDisciplineInput } from "../../../types/discipline";

type DisciplineFormType = z.infer<typeof disciplineSchema>;

export default function DisciplineForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToastLoading();
  const user = useStorage().getUser();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DisciplineFormType>({
    resolver: zodResolver(disciplineSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      materialUrl: "",
      period: 1,
      workload: "0",
      teacherId: "",
      schedules: [{ dayOfWeek: 1, startTime: "08:00", endTime: "10:00" }],
      prerequisiteIds: [],
    },
  });

  const schedulesFieldArray = useFieldArray({
    control,
    name: "schedules",
  });

  const [teachers, setTeachers] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [prerequisites, setPrerequisites] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const loadTeachersAndPrereqs = async () => {
      const response = await getAllUsers({ role: "TEACHER" });
      setTeachers(
        (response.data?.data || []).map((t) => ({
          value: t.id,
          label: t.name,
        })),
      );

      const prereqRes = await listDisciplines();
      setPrerequisites(
        (prereqRes.data?.data || []).map((d) => ({
          value: d.id,
          label: d.name,
        })),
      );
    };

    const loadDiscipline = async () => {
      if (!id) return;
      const res = await getDisciplineById(id);
      if (res.success && res.data) {
        reset({
          ...res.data,
          workload: String(res.data.workload),
          prerequisiteIds:
            res.data.prerequisites?.map((p) => p.prerequisiteId) || [],
        });
      } else {
        toast({ mensagem: res.message, tipo: res.type });
        navigate("/disciplinas");
      }
    };

    loadTeachersAndPrereqs();
    if (isEdit) loadDiscipline();
  }, [id, isEdit]);

  const onSubmit = async (data: DisciplineFormType) => {
    if (!user) {
      toast({ mensagem: "Usuário não autenticado.", tipo: "error" });
      navigate("/disciplinas");
      return;
    }

    const { prerequisiteIds, ...rest } = data;
    const payloadForApi: CreateDisciplineInput = {
      ...rest,
      period: Number(data.period),
      workload: Number(data.workload),
      prerequisites: prerequisiteIds?.length
        ? prerequisiteIds.map((id) => ({ prerequisiteId: id }))
        : [],
    };

    const response = isEdit
      ? await updateDiscipline(id!, payloadForApi)
      : await createDiscipline(payloadForApi);

    toast({ mensagem: response.message, tipo: response.type });
    navigate("/disciplinas");
  };

  const daysOfWeekOptions = [
    { value: 0, label: "Domingo" },
    { value: 1, label: "Segunda-feira" },
    { value: 2, label: "Terça-feira" },
    { value: 3, label: "Quarta-feira" },
    { value: 4, label: "Quinta-feira" },
    { value: 5, label: "Sexta-feira" },
    { value: 6, label: "Sábado" },
  ];

  return (
    <Box loading={isEdit && isSubmitting}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Seção básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputText
            name="name"
            label="Nome da Disciplina"
            register={register}
            errors={errors}
            placeholder="Digite o nome"
          />
          <InputText
            name="code"
            label="Código"
            register={register}
            errors={errors}
            placeholder="Ex: MAT101"
          />
          <InputText
            name="workload"
            label="Carga Horária (horas)"
            register={register}
            errors={errors}
            type="number"
          />
          <InputSelect
            control={control}
            name="period"
            label="Período"
            options={[
              { value: 1, label: "1º período" },
              { value: 2, label: "2º período" },
              { value: 3, label: "3º período" },
              { value: 4, label: "4º período" },
              { value: 5, label: "5º período" },
              { value: 6, label: "6º período" },
              { value: 7, label: "7º período" },
              { value: 8, label: "8º período" },
              { value: 9, label: "9º período" },
              { value: 0, label: "Optativa" },
            ]}
            placeholder="Selecione o período"
          />
          <InputSelect
            control={control}
            name="teacherId"
            label="Professor Responsável"
            errors={errors}
            options={teachers}
            placeholder="Selecione um professor"
          />
        </div>

        {/* Descrição e Material */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputText
            name="description"
            label="Descrição"
            register={register}
            errors={errors}
            placeholder="Descrição da disciplina"
            required={false}
          />
          <InputText
            name="materialUrl"
            label="URL do Material"
            register={register}
            errors={errors}
            placeholder="https://..."
            type="url"
            required={false}
          />
        </div>

        {/* Pré-requisitos */}

        <InputSelect
          control={control}
          name="prerequisiteIds"
          label="Pré-requisitos"
          errors={errors}
          options={prerequisites}
          placeholder="Selecione pré-requisitos"
          isMulti
        />

        <div className="mt-6">
          <div className="flex w-full justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Horários da Disciplina</h2>
            <Button
              type="default"
              model="button"
              text="Adicionar Horário"
              onClick={() =>
                schedulesFieldArray.append({
                  dayOfWeek: 1,
                  startTime: "08:00",
                  endTime: "10:00",
                })
              }
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            />
          </div>

          <div className="space-y-4">
            {schedulesFieldArray.fields.map((field, idx) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 "
              >
                <InputSelect
                  control={control}
                  name={`schedules.${idx}.dayOfWeek`}
                  label="Dia da semana"
                  options={daysOfWeekOptions}
                  errors={errors}
                />
                <InputText
                  name={`schedules.${idx}.startTime`}
                  label="Início"
                  type="time"
                  register={register}
                  errors={errors}
                />
                <InputText
                  name={`schedules.${idx}.endTime`}
                  label="Fim"
                  type="time"
                  register={register}
                  errors={errors}
                />
                <button
                  type="button"
                  onClick={() => schedulesFieldArray.remove(idx)}
                  className=" text-red-500 hover:text-red-600 transition-colors "
                >
                  <HiTrash className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Botões principais */}
        <div className="flex justify-end gap-4 mt-4">
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
            text={isEdit ? "Atualizar" : "Criar Disciplina"}
            model="submit"
          />
        </div>
      </form>
    </Box>
  );
}
