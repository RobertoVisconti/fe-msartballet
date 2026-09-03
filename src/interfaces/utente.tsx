export type LarghezzaPunte =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "X"
  | "XX"
  | "XXX"
  | "XXXX"
  | "XXXXX"
  | "NARROW"
  | "MEDIUM"
  | "WIDE";

export interface AllievoRespDTO {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  dataDiNascita: string;
  imgProfilo: string | null;
  ruolo: "ALLIEVO";
  dataRegistrazione: string;
  accountAttivo: boolean;
  maiAttivato: boolean;
  numeroScarpetta: string | null;
  marcaScarpetta: string | null;
  haPunte: boolean | null;
  marcaPunte: string | null;
  larghezzaPunte: LarghezzaPunte | null;
  tagliaBody: string | null;
  tagliaCalzini: string | null;
  altezzaCm: number | null;
  tagliaPantalone: string | null;
  dataScadenzaCertificato: string | null;
  contattoEmergenzaNome: string | null;
  contattoEmergenzaTelefono: string | null;
  codiceFiscale: string | null;
  quotaIscrizionePagata: boolean | null;
  consensoPrivacyFoto: boolean | null;
  noteSegreteria: string | null;
}

export interface AggiornaAllievoDTO {
  nome: string;
  cognome: string;
  email: string;
  dataDiNascita: string;
  numeroScarpetta?: string;
  marcaScarpetta?: string;
  haPunte?: boolean;
  marcaPunte?: string;
  larghezzaPunte?: LarghezzaPunte;
  tagliaBody?: string;
  tagliaCalzini?: string;
  altezzaCm?: number;
  tagliaPantalone?: string;
  dataScadenzaCertificato?: string;
  contattoEmergenzaNome?: string;
  contattoEmergenzaTelefono?: string;
  codiceFiscale?: string;
  quotaIscrizionePagata?: boolean;
  consensoPrivacyFoto?: boolean;
  noteSegreteria?: string;
}

export interface InsegnanteRespDTO {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  dataDiNascita: string;
  imgProfilo: string | null;
  ruolo: "INSEGNANTE";
  dataRegistrazione: string;
  accountAttivo: boolean;
  maiAttivato: boolean;
  biografia: string;
}

export interface AggiornaInsegnanteDTO {
  nome: string;
  cognome: string;
  email: string;
  dataDiNascita: string;
  biografia: string;
}

export interface OspiteRespDTO {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string | null;
  dataDiNascita: string | null;
  imgProfilo: string | null;
  ruolo: "OSPITE";
  dataRegistrazione: string;
}

export interface AdminRespDTO {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  dataDiNascita: string;
  imgProfilo: string | null;
  ruolo: "ADMIN";
  dataRegistrazione: string;
  accountAttivo: boolean;
  maiAttivato: boolean;
  protetto: boolean;
}

export type UtenteMe =
  | AllievoRespDTO
  | InsegnanteRespDTO
  | OspiteRespDTO
  | AdminRespDTO;

export interface CambiaPasswordDTO {
  vecchiaPassword: string;
  nuovaPassword: string;
}

export interface ImmagineRespDTO {
  url: string;
}

export interface InsegnantePubblicoRespDTO {
  id: string;
  nome: string;
  cognome: string;
  imgProfilo: string | null;
  biografia: string;
}
