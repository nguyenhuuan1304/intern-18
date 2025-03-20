// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthUser,
  ChangePasswordResponse,
  ForgotPasswordResponse,
  LoginResponse,
  RegisterResponse,
} from "@/components/product/types/Auth.type";
import axios from "axios";
import { User } from "@/components/header/Header";

interface AuthState {
  token: string | null;
  user: {
    id: number;
    name?: string;
    username?: string;
    email: string;
    documentId?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};
interface ErrorResponse {
  message?: string;
}

export const registerUser = createAsyncThunk<
  { token: string; user: AuthUser },
  { username: string; email: string; password: string },
  { rejectValue: ErrorResponse }
>("auth/register", async (payload, thunkAPI) => {
  try {
    const response = await axios.post<RegisterResponse>(
      "http://localhost:1337/api/auth/local/register",
      payload
    );
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const loginUser = createAsyncThunk<
{jwt : string ; user : AuthUser},
{identifier : string ; password : string},
{rejectValue : ErrorResponse}
>(
  "auth/login",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post<LoginResponse>(
        "http://localhost:1337/api/auth/local",
        payload
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const forgotPasswordUser = createAsyncThunk<
  { ok: boolean; message: string },
  { email: string },
  { rejectValue: ErrorResponse }
>("auth/forgotPassword", async (payload, thunkAPI) => {
  try {
    const response = await axios.post<ForgotPasswordResponse>(
      "http://localhost:1337/api/auth/forgot-password",
      payload
    );
    console.log("response", response);
    return response.data;
  } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  
});

export const resetPasswordUser = createAsyncThunk<
  { ok: boolean; message: string },
  { code: string; password: string; passwordConfirmation: string },
  { rejectValue: ErrorResponse }
>(
  "auth/resetPassword",
  async (
    payload,
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:1337/api/auth/reset-password",
        payload
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const changePasswordUser = createAsyncThunk<
  { user: User },
  {
    changePasswordPayload: {
      currentPassword: string;
      password: string;
      passwordConfirmation: string;
    };
    jwt: string;
  },
  { rejectValue: ErrorResponse }
>("auth/changePassword", async ({ changePasswordPayload, jwt }, thunkAPI) => {
  try {
    const response = await axios.post<ChangePasswordResponse>(
      "http://localhost:1337/api/auth/change-password",
      changePasswordPayload,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Đăng ký thất bại";
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ jwt: string; user: AuthUser }>) => {
          state.loading = false;
          state.token = action.payload.jwt;
          state.user = action.payload.user;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Đăng nhập thất bại";
      })

      .addCase(forgotPasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Quên mật khẩu thất bại";
      })

      .addCase(changePasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        changePasswordUser.fulfilled,(state)=> {
          state.loading = false;
        }
      )
      .addCase(changePasswordUser.rejected, (state) => {
        state.loading = false;
      });

      
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
