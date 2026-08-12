import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { SpettacoloRespDTO, SpettacoloDTO } from "@/interfaces/galleria";

export interface FiltriSpettacoli {
  page?: number;
  size?: number;
}

export const spettacoloApi = {
  lista: (filtri: FiltriSpettacoli) =>
    axiosInstance
      .get<Page<SpettacoloRespDTO>>("/spettacoli", { params: filtri })
      .then((res) => res.data),

  crea: (dto: SpettacoloDTO) =>
    axiosInstance
      .post<SpettacoloRespDTO>("/spettacoli", dto)
      .then((res) => res.data),

  modifica: (id: string, dto: SpettacoloDTO) =>
    axiosInstance
      .put<SpettacoloRespDTO>(`/spettacoli/${id}`, dto)
      .then((res) => res.data),

  elimina: (id: string) =>
    axiosInstance.delete<void>(`/spettacoli/${id}`).then((res) => res.data),
};
