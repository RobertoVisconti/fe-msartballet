import type { UtenteAutenticato } from "@/interfaces/auth";

const TOKEN_KEY = "msab_access_token";
const USER_KEY = "msab_utente";

export function leggiToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function leggiUtente(): UtenteAutenticato | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as UtenteAutenticato) : null;
}

export function salvaSessione(
  accessToken: string,
  utente: UtenteAutenticato,
): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(utente));
}

export function cancellaSessione(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
