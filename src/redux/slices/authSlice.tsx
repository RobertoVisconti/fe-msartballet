import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { AuthState } from "@/interfaces/auth";
import {
  loginUser,
  attivaAccount,
  resetPassword,
} from "@/redux/thunks/authThunks";
import {
  leggiToken,
  leggiUtente,
  salvaSessione,
  cancellaSessione,
} from "@/utils/authStorage";

function leggiStatoIniziale(): AuthState {
  const accessToken = leggiToken();
  const utente = leggiUtente();

  return {
    accessToken,
    utente,
    isAuthenticated: Boolean(accessToken && utente),
    status: "idle",
    error: null,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState: leggiStatoIniziale(),
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.utente = null;
      state.isAuthenticated = false;
      cancellaSessione();
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          loginUser.pending,
          attivaAccount.pending,
          resetPassword.pending,
        ),
        (state) => {
          state.status = "loading";
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(
          loginUser.fulfilled,
          attivaAccount.fulfilled,
          resetPassword.fulfilled,
        ),
        (state, action) => {
          const { accessToken, id, nome, cognome, ruolo } = action.payload;
          state.accessToken = accessToken;
          state.utente = { id, nome, cognome, ruolo };
          state.isAuthenticated = true;
          state.status = "succeeded";
          salvaSessione(accessToken, state.utente);
        },
      )
      .addMatcher(
        isAnyOf(
          loginUser.rejected,
          attivaAccount.rejected,
          resetPassword.rejected,
        ),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload ?? "Si è verificato un errore";
        },
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
