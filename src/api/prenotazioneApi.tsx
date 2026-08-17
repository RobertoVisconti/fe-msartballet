import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type {
  PrenotazioneRespDTO,
  NewPrenotazioneDTO,
  NewPrenotazioneOspiteDTO,
  CambiaStatoPrenotazioneDTO,
} from "@/interfaces/prenotazione";

export interface FiltriPrenotazioni {
  idUtente?: string;
  idLezione?: string;
  stato?: string;
  page?: number;
  size?: number;
}

export const prenotazioneApi = {
  crea: (dto: NewPrenotazioneDTO) =>
    axiosInstance
      .post<PrenotazioneRespDTO>("/prenotazioni", dto)
      .then((res) => res.data),

  creaOspite: (dto: NewPrenotazioneOspiteDTO) =>
    axiosInstance
      .post<PrenotazioneRespDTO>("/prenotazioni/ospite", dto)
      .then((res) => res.data),

  lista: (filtri: FiltriPrenotazioni) =>
    axiosInstance
      .get<Page<PrenotazioneRespDTO>>("/prenotazioni", { params: filtri })
      .then((res) => res.data),

  cambiaStato: (id: string, dto: CambiaStatoPrenotazioneDTO) =>
    axiosInstance
      .patch<PrenotazioneRespDTO>(`/prenotazioni/${id}/stato`, dto)
      .then((res) => res.data),

  elimina: (id: string) =>
    axiosInstance.delete<void>(`/prenotazioni/${id}`).then((res) => res.data),
};
