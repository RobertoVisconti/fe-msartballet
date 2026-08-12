export interface LezioneRespDTO {
  id: string;
  dataOraInizio: string;
  dataOraFine: string;
  prezzoLezione: number;
  idCorso: string;
  titoloCorso: string;
  idSala: string;
  titoloSala: string;
}

export interface NewLezioneDTO {
  dataOraInizio: string;
  dataOraFine: string;
  prezzoLezione: number;
  idCorso: string;
  idSala: string;
}
