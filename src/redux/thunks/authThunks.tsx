import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { authApi } from "@/api/authApi";
import type {
  LoginDTO,
  LoginRespDTO,
  AttivazioneAccountDTO,
  ResetPasswordDTO,
} from "@/interfaces/auth";
import type { ErrorsDTO } from "@/interfaces/common";

function estraiMessaggioErrore(err: unknown, messaggioDefault: string): string {
  const error = err as AxiosError<ErrorsDTO>;
  return error.response?.data?.message ?? messaggioDefault;
}

export const loginUser = createAsyncThunk<
  LoginRespDTO,
  LoginDTO,
  { rejectValue: string }
>("auth/loginUser", async (credenziali, { rejectWithValue }) => {
  try {
    return await authApi.login(credenziali);
  } catch (err) {
    return rejectWithValue(
      estraiMessaggioErrore(err, "Email o password non corretti"),
    );
  }
});

export const attivaAccount = createAsyncThunk<
  LoginRespDTO,
  AttivazioneAccountDTO,
  { rejectValue: string }
>("auth/attivaAccount", async (dto, { rejectWithValue }) => {
  try {
    return await authApi.attivaAccount(dto);
  } catch (err) {
    return rejectWithValue(
      estraiMessaggioErrore(err, "Token di attivazione non valido o scaduto"),
    );
  }
});

export const resetPassword = createAsyncThunk<
  LoginRespDTO,
  ResetPasswordDTO,
  { rejectValue: string }
>("auth/resetPassword", async (dto, { rejectWithValue }) => {
  try {
    return await authApi.resetPassword(dto);
  } catch (err) {
    return rejectWithValue(
      estraiMessaggioErrore(err, "Token di reset non valido o scaduto"),
    );
  }
});
