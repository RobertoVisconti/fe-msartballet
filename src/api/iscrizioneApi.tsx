import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type {
  IscrizioneRespDTO,
  NewIscrizioneDTO,
  CambiaStatoIscrizioneDTO,
} from "@/interfaces/iscrizione";

export interface FiltriIscrizioni {
  idAllievo?: string;
  idCorso?: string;
  stato?: string;
  page?: number;
  size?: number;
}

export const iscrizioneApi = {
  crea: (dto: NewIscrizioneDTO) =>
    axiosInstance
      .post<IscrizioneRespDTO>("/iscrizioni", dto)
      .then((res) => res.data),

  lista: (filtri: FiltriIscrizioni) =>
    axiosInstance
      .get<Page<IscrizioneRespDTO>>("/iscrizioni", { params: filtri })
      .then((res) => res.data),

  mie: (filtri: { page?: number; size?: number }) =>
    axiosInstance
      .get<Page<IscrizioneRespDTO>>("/iscrizioni/mie", { params: filtri })
      .then((res) => res.data),

  cambiaStato: (id: string, dto: CambiaStatoIscrizioneDTO) =>
    axiosInstance
      .patch<IscrizioneRespDTO>(`/iscrizioni/${id}/stato`, dto)
      .then((res) => res.data),

  elimina: (id: string) =>
    axiosInstance.delete<void>(`/iscrizioni/${id}`).then((res) => res.data),
};
