import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, UtenteAutenticato } from "@/types/auth.types";

const TOKEN_STORAGE_KEY = "msab_access_token";
const USER_STORAGE_KEY = "msab_utente";

function leggiStatoIniziale(): AuthState {
  const accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  const utenteRaw = localStorage.getItem(USER_STORAGE_KEY);
  const utente = utenteRaw
    ? (JSON.parse(utenteRaw) as UtenteAutenticato)
    : null;

  return {
    accessToken,
    utente,
    isAuthenticated: Boolean(accessToken && utente),
  };
}

interface CredenzialiPayload {
  accessToken: string;
  utente: UtenteAutenticato;
}

const authSlice = createSlice({
  name: "auth",
  initialState: leggiStatoIniziale(),
  reducers: {
    setCredenziali: (state, action: PayloadAction<CredenzialiPayload>) => {
      state.accessToken = action.payload.accessToken;
      state.utente = action.payload.utente;
      state.isAuthenticated = true;
      localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.accessToken);
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(action.payload.utente),
      );
    },
    logout: (state) => {
      state.accessToken = null;
      state.utente = null;
      state.isAuthenticated = false;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    },
  },
});

export const { setCredenziali, logout } = authSlice.actions;
export default authSlice.reducer;
