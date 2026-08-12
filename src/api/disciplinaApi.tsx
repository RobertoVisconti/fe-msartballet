import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type {
  DisciplinaRespDTO,
  NewDisciplinaDTO,
} from "@/interfaces/catalogo";

export interface FiltriDiscipline {
  page?: number;
  size?: number;
}

export const disciplinaApi = {
  lista: (filtri: FiltriDiscipline) =>
    axiosInstance
      .get<Page<DisciplinaRespDTO>>("/discipline", { params: filtri })
      .then((res) => res.data),

  crea: (dto: NewDisciplinaDTO) =>
    axiosInstance
      .post<DisciplinaRespDTO>("/discipline", dto)
      .then((res) => res.data),

  modifica: (id: string, dto: NewDisciplinaDTO) =>
    axiosInstance
      .put<DisciplinaRespDTO>(`/discipline/${id}`, dto)
      .then((res) => res.data),

  elimina: (id: string) =>
    axiosInstance.delete<void>(`/discipline/${id}`).then((res) => res.data),
};
