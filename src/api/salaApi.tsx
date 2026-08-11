import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { SalaRespDTO } from "@/interfaces/catalogo";

export interface FiltriSale {
  page?: number;
  size?: number;
}

export const salaApi = {
  lista: (filtri: FiltriSale) =>
    axiosInstance
      .get<Page<SalaRespDTO>>("/sale", { params: filtri })
      .then((res) => res.data),
};
