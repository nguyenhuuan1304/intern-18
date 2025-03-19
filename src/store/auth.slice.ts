// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import http from "../hooks/useAxios";
import {
  AuthUser,
  ForgotPasswordResponse,
  LoginResponse,
  RegisterResponse,
} from "@/components/product/types/Auth.type";
import axios from "axios";

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
    const response = await http.post<RegisterResponse>(
      "/auth/local/register",
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
      const response = await http.post<LoginResponse>("/auth/local" , payload);
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
      const response = await http.post("/auth/reset-password" , payload);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

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

      .addCase(resetPasswordUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Đặt lại mật khẩu thất bại";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
