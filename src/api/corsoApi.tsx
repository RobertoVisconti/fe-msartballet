import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { CorsoRespDTO } from "@/interfaces/catalogo";

export interface FiltriCorsi {
  page?: number;
  size?: number;
}

export const corsoApi = {
  lista: (filtri: FiltriCorsi) =>
    axiosInstance
      .get<Page<CorsoRespDTO>>("/corsi", { params: filtri })
      .then((res) => res.data),
};
