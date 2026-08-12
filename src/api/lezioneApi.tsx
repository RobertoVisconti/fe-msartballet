import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { LezioneRespDTO, NewLezioneDTO } from "@/interfaces/lezione";

export interface FiltriLezioni {
  idCorso?: string;
  idSala?: string;
  dal?: string;
  al?: string;
  page?: number;
  size?: number;
}

export const lezioneApi = {
  lista: (filtri: FiltriLezioni) =>
    axiosInstance
      .get<Page<LezioneRespDTO>>("/lezioni", { params: filtri })
      .then((res) => res.data),

  ottieni: (id: string) =>
    axiosInstance.get<LezioneRespDTO>(`/lezioni/${id}`).then((res) => res.data),

  crea: (dto: NewLezioneDTO) =>
    axiosInstance.post<LezioneRespDTO>("/lezioni", dto).then((res) => res.data),

  modifica: (id: string, dto: NewLezioneDTO) =>
    axiosInstance
      .put<LezioneRespDTO>(`/lezioni/${id}`, dto)
      .then((res) => res.data),

  elimina: (id: string) =>
    axiosInstance.delete<void>(`/lezioni/${id}`).then((res) => res.data),
};
