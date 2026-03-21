import moment from "moment";
import Decimal from "decimal.js";

export const converterDecimal = (
  valor: string | number,
  decimalPlaces: number = 2,
) => {
  return new Decimal(valor)
    .toDecimalPlaces(decimalPlaces, Decimal.ROUND_UP)
    .toString();
};

export const formatPhone = (telefone: string): string => {
  if (!telefone) return "";
  let r = telefone.replace(/\D/g, "");
  r = r.replace(/^0/, "");
  if (r.length > 10) {
    r = r.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (r.length > 5) {
    r = r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (r.length > 2) {
    r = r.replace(/^(\d\d)(\d{0,5})/, "($1) $2");
  } else {
    r = r.replace(/^(\d*)/, "($1");
  }
  return r;
};

export const formatCpf = (cpf: string, mensagemInvalido?: boolean): string => {
  if (!cpf) return "Não informado";

  if (cpf.length != 11 && mensagemInvalido) return `${cpf} (CPF Inválido)`;

  let r = cpf.replace(/\D/g, "");
  r = r.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4");

  return r;
};

export const removeMask = (item: string): string => {
  return item.replace(/\D/g, "");
};

export const formatDateTime = (
  data: Date | string,
  tipo: "" | "data" | "hora" = "",
  segundos: boolean = false,
): string => {
  if (tipo == "data") return moment(data).format("DD/MM/YYYY");
  if (tipo == "hora")
    return segundos
      ? moment(data).format("HH:mm:ss")
      : moment(data).format("HH:mm");
  return segundos
    ? moment(data).format("DD/MM/YYYY HH:mm:ss")
    : moment(data).format("DD/MM/YYYY HH:mm");
};

export const formatDateName = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatDecimal = (
  valor: string | number,
  decimalPlaces: number = 2,
): string => {
  if (valor === 0) return "0";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimalPlaces,
  }).format(Number(converterDecimal(valor, decimalPlaces)));
};

export const handleCopy = async (text: string, toast: (options: { mensagem: string, tipo: string }) => void) => {
  try {
    await navigator.clipboard.writeText(text);
    toast({ mensagem: "Texto copiado com sucesso!", tipo: "success" });
  } catch {
    toast({ mensagem: "Erro ao copiar", tipo: "error" });
  }
};

export const isTimeOverlapping = (
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean => {
  const [h1, m1] = start1.split(":").map(Number);
  const [h2, m2] = end1.split(":").map(Number);
  const [h3, m3] = start2.split(":").map(Number);
  const [h4, m4] = end2.split(":").map(Number);

  const s1 = h1 * 60 + m1;
  const e1 = h2 * 60 + m2;
  const s2 = h3 * 60 + m3;
  const e2 = h4 * 60 + m4;

  return s1 < e2 && s2 < e1;
};
