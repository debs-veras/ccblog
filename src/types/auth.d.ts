export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginData = {
  token?: string;
  user?: unknown;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  email: string;
};
