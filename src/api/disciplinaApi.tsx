import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { DisciplinaRespDTO } from "@/interfaces/catalogo";

export interface FiltriDiscipline {
  page?: number;
  size?: number;
}

export const disciplinaApi = {
  lista: (filtri: FiltriDiscipline) =>
    axiosInstance
      .get<Page<DisciplinaRespDTO>>("/discipline", { params: filtri })
      .then((res) => res.data),
};
