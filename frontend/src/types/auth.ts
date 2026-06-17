export type AuthUser = {
  name: string;
  email: string;
  role: string;
  passwordLength: number | null;
  avatarText: string;
  hasAvatar: boolean;
  avatarVersion: number | null;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};