import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { SalaRespDTO, SalaDTO } from "@/interfaces/catalogo";

export interface FiltriSale {
  page?: number;
  size?: number;
}

export const salaApi = {
  lista: (filtri: FiltriSale) =>
    axiosInstance
      .get<Page<SalaRespDTO>>("/sale", { params: filtri })
      .then((res) => res.data),

  crea: (dto: SalaDTO) =>
    axiosInstance.post<SalaRespDTO>("/sale", dto).then((res) => res.data),

  modifica: (id: string, dto: SalaDTO) =>
    axiosInstance.put<SalaRespDTO>(`/sale/${id}`, dto).then((res) => res.data),

  elimina: (id: string) =>
    axiosInstance.delete<void>(`/sale/${id}`).then((res) => res.data),
};
