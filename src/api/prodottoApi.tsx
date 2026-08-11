import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { ProdottoRespDTO } from "@/interfaces/catalogo";

export interface FiltriProdotti {
  page?: number;
  size?: number;
}

export const prodottoApi = {
  lista: (filtri: FiltriProdotti) =>
    axiosInstance
      .get<Page<ProdottoRespDTO>>("/prodotti", { params: filtri })
      .then((res) => res.data),
};
