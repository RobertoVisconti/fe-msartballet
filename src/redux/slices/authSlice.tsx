import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "@/interfaces/auth";
import { loginUser } from "@/redux/thunks/authThunks";
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
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { accessToken, id, nome, cognome, ruolo } = action.payload;
        state.accessToken = accessToken;
        state.utente = { id, nome, cognome, ruolo };
        state.isAuthenticated = true;
        state.status = "succeeded";
        salvaSessione(accessToken, state.utente);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Errore durante il login";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
