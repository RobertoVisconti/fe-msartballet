export type StatoIscrizione = "ATTIVA" | "COMPLETATA" | "ANNULLATA";

export interface IscrizioneRespDTO {
  id: string;
  dataIscrizione: string;
  stato: StatoIscrizione;
  idAllievo: string;
  nomeAllievo: string;
  idCorso: string;
  titoloCorso: string;
}

export interface NewIscrizioneDTO {
  idAllievo: string;
  idCorso: string;
}

export interface CambiaStatoIscrizioneDTO {
  stato: StatoIscrizione;
}
