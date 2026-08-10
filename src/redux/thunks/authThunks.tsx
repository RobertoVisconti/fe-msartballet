import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { authApi } from "@/api/authApi";
import type { LoginDTO, LoginRespDTO } from "@/interfaces/auth";
import type { ErrorsDTO } from "@/interfaces/common";

export const loginUser = createAsyncThunk<
  LoginRespDTO,
  LoginDTO,
  { rejectValue: string }
>("auth/loginUser", async (credenziali, { rejectWithValue }) => {
  try {
    return await authApi.login(credenziali);
  } catch (err) {
    const error = err as AxiosError<ErrorsDTO>;
    return rejectWithValue(
      error.response?.data?.message ?? "Email o password non corretti",
    );
  }
});
