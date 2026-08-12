import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type {
  TransazioneRespDTO,
  NewTransazioneDTO,
} from "@/interfaces/transazione";

export interface FiltriTransazioni {
  idUtente?: string;
  idProdotto?: string;
  idCorso?: string;
  idSala?: string;
  dal?: string;
  al?: string;
  page?: number;
  size?: number;
}

export const transazioneApi = {
  crea: (dto: NewTransazioneDTO) =>
    axiosInstance
      .post<TransazioneRespDTO>("/transazioni", dto)
      .then((res) => res.data),

  lista: (filtri: FiltriTransazioni) =>
    axiosInstance
      .get<Page<TransazioneRespDTO>>("/transazioni", { params: filtri })
      .then((res) => res.data),

  elimina: (id: string) =>
    axiosInstance.delete<void>(`/transazioni/${id}`).then((res) => res.data),
};
