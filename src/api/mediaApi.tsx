import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { MediaRespDTO, NewMediaDTO } from "@/interfaces/galleria";

export interface FiltriMedia {
  page?: number;
  size?: number;
}

export const mediaApi = {
  lista: (filtri: FiltriMedia) =>
    axiosInstance
      .get<Page<MediaRespDTO>>("/media", { params: filtri })
      .then((res) => res.data),

  crea: (dto: NewMediaDTO) =>
    axiosInstance.post<MediaRespDTO>("/media", dto).then((res) => res.data),

  modifica: (id: string, dto: NewMediaDTO) =>
    axiosInstance
      .put<MediaRespDTO>(`/media/${id}`, dto)
      .then((res) => res.data),

  elimina: (id: string) =>
    axiosInstance.delete<void>(`/media/${id}`).then((res) => res.data),
};
