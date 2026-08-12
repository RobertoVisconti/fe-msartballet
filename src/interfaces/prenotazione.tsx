export type StatoPrenotazione =
  | "IN_ATTESA"
  | "CONFERMATA"
  | "ANNULLATA"
  | "COMPLETATA";

export interface PrenotazioneRespDTO {
  id: string;
  statoPrenotazione: StatoPrenotazione;
  dataPrenotazione: string;
  idUtente: string;
  nomeUtente: string;
  idLezione: string;
}

export interface NewPrenotazioneDTO {
  idUtente: string;
  idLezione: string;
}

export interface CambiaStatoPrenotazioneDTO {
  statoPrenotazione: StatoPrenotazione;
}
