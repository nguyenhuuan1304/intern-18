import axios from "axios";

interface RegisterPayload {
 username : string;
 email: string;
 password: string;
}
interface RegisterResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
interface LoginPayload {
  identifier: string;
  password: string;
}

interface LoginResponse {
  jwt: string;
  user: {
    id: number;
    documentId: string;
    username : string;
    email: string;
  };
}


interface ForgotPasswordPayload {
  email: string;

}
interface ForgotPasswordResponse {
  ok: boolean;
  message: string;
}

interface ResetPasswordPayload {
  code : string;
  password: string;
  passwordConfirmation: string;
}

interface ResetPasswordResponse {
  ok: boolean;
  message: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

interface ChangePasswordResponse {
  ok: boolean;
  message: string;
}

const authApi = {
  register: async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await axios.post<RegisterResponse>(
      "http://localhost:1337/api/auth/local/register",
      data
    );
    return response.data;
  },
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await axios.post(
      "http://localhost:1337/api/auth/local",
      data
    );
    return response.data;
  },

  forgotPassword: async (
    data: ForgotPasswordPayload
  ): Promise<ForgotPasswordResponse> => {
    const response = await axios.post<ForgotPasswordResponse>(
      "http://localhost:1337/api/auth/forgot-password",
      data
    );
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordPayload
  ): Promise<ResetPasswordResponse> => {
    const response = await axios.post<ResetPasswordResponse>(
      "http://localhost:1337/api/auth/reset-password",
      data
    );
    return response.data;
  },
  changePassword: async (
    data: ChangePasswordPayload,
    token?: string 
  ): Promise<ChangePasswordResponse> => {
    const response = await axios.post<ChangePasswordResponse>(
      "http://localhost:1337/api/auth/change-password",
      data,
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }
    );
    return response.data;
  },
};


export default authApi;

