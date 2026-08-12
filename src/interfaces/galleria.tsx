export type TipoMedia = "FOTO" | "MEDIA";

export interface SpettacoloRespDTO {
  id: string;
  titolo: string;
  descrizione: string;
  dataEvento: string;
  luogo: string;
}

export interface MediaRespDTO {
  id: string;
  url: string;
  tipoMedia: TipoMedia;
  titolo: string;
  idSpettacolo: string;
}

export interface SpettacoloDTO {
  titolo: string;
  descrizione?: string;
  dataEvento: string;
  luogo: string;
}
