import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { CorsoRespDTO, NewCorsoDTO } from "@/interfaces/catalogo";

export interface FiltriCorsi {
  page?: number;
  size?: number;
}

export const corsoApi = {
  lista: (filtri: FiltriCorsi) =>
    axiosInstance
      .get<Page<CorsoRespDTO>>("/corsi", { params: filtri })
      .then((res) => res.data),

  crea: (dto: NewCorsoDTO) =>
    axiosInstance.post<CorsoRespDTO>("/corsi", dto).then((res) => res.data),

  modifica: (id: string, dto: NewCorsoDTO) =>
    axiosInstance
      .put<CorsoRespDTO>(`/corsi/${id}`, dto)
      .then((res) => res.data),

  elimina: (id: string) =>
    axiosInstance.delete<void>(`/corsi/${id}`).then((res) => res.data),
};
