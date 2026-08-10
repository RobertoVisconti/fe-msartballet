export interface UtenteAutenticato {
  id: string;
  nome: string;
  cognome: string;
  ruolo: RuoloUtente;
}

export interface AuthState {
  utente: UtenteAutenticato | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
