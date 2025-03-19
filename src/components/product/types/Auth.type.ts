export interface AuthUser {
  id: number;
  name?: string;
  username?: string;
  email: string;
  documentId?: string;
}


export interface RegisterResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface LoginResponse {
  jwt: string;
  user: {
    id: number;
    documentId: string;
    username: string;
    email: string;
  };
}

export interface ForgotPasswordResponse {
  ok: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  ok: boolean;
  message: string;
}
