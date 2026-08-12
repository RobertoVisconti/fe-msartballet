export interface TransazioneRespDTO {
  id: string;
  dataTransazione: string;
  importo: number;
  metodoPagamento: string;
  idUtente: string;
  idProdotto: string | null;
  idCorso: string | null;
  idSala: string | null;
}

export interface NewTransazioneDTO {
  metodoPagamento: string;
  idUtente: string;
  idProdotto?: string;
  idCorso?: string;
  idSala?: string;
}
