export type RuoloUtente =
  | "ADMIN"
  | "UTENTE"
  | "ALLIEVO"
  | "INSEGNANTE"
  | "OSPITE";

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
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginRespDTO {
  accessToken: string;
  id: string;
  nome: string;
  cognome: string;
  ruolo: RuoloUtente;
}

export interface OspiteRegistrazioneDTO {
  nome: string;
  cognome: string;
  email: string;
  dataDiNascita: string;
}

export interface OspiteRespDTO {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  dataDiNascita: string;
  imgProfilo: string | null;
  ruolo: RuoloUtente;
  dataRegistrazione: string;
}

export interface AttivazioneAccountDTO {
  token: string;
  nuovaPassword: string;
}

export interface RichiestaResetPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  nuovaPassword: string;
}
