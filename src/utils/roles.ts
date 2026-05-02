const roleLabels: Record<string, string> = {
  ADMIN: "Administrador(a)",
  TEACHER: "Professor(a)",
  STUDENT: "Aluno(a)",
};

export function getRoleLabel(role?: string): string {
  if (!role) return "-";
  return roleLabels[role] || role;
}

export const roleOptions = [
  { value: "ADMIN", label: "Administrador" },
  { value: "TEACHER", label: "Professor(a)" },
  { value: "STUDENT", label: "Aluno(a)" },
];
