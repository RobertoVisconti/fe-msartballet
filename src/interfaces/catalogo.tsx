export type LivelloCorso = "PRINCIPIANTE" | "INTERMEDIO" | "AVANZATO";

export type GiornoSettimana =
  | "LUNEDI"
  | "MARTEDI"
  | "MERCOLEDI"
  | "GIOVEDI"
  | "VENERDI"
  | "SABATO"
  | "DOMENICA";

export interface DisciplinaRespDTO {
  id: string;
  nome: string;
  descrizione: string;
}

export interface CorsoRespDTO {
  id: string;
  titolo: string;
  descrizione: string;
  livelloCorso: LivelloCorso;
  giornoSettimana: GiornoSettimana;
  oraInizio: string;
  oraFine: string;
  prezzoMensile: number;
  idDisciplina: string;
  nomeDisciplina: string;
  idInsegnante: string;
  nomeInsegnante: string;
}

export interface SalaRespDTO {
  id: string;
  titolo: string;
  imgSala: string;
  prezzoAffitto: number;
}

export interface ProdottoRespDTO {
  id: string;
  titolo: string;
  descrizioneProdotto: string;
  imgProdotto: string;
  prezzoProdotto: number;
}

export interface NewDisciplinaDTO {
  nome: string;
  descrizione?: string;
}

export interface SalaDTO {
  titolo: string;
  imgSala: string;
  prezzoAffitto: number;
}

export interface NewProdottoDTO {
  titolo: string;
  descrizioneProdotto?: string;
  imgProdotto?: string;
  prezzoProdotto: number;
}

export interface NewCorsoDTO {
  titolo: string;
  descrizione: string;
  livelloCorso: LivelloCorso;
  giornoSettimana: GiornoSettimana;
  oraInizio: string;
  oraFine: string;
  prezzoMensile: number;
  idDisciplina: string;
  idInsegnante: string;
}
