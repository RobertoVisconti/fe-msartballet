import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { ProdottoRespDTO, NewProdottoDTO } from "@/interfaces/catalogo";

export interface FiltriProdotti {
  page?: number;
  size?: number;
}

export const prodottoApi = {
  lista: (filtri: FiltriProdotti) =>
    axiosInstance
      .get<Page<ProdottoRespDTO>>("/prodotti", { params: filtri })
      .then((res) => res.data),

  crea: (dto: NewProdottoDTO) =>
    axiosInstance
      .post<ProdottoRespDTO>("/prodotti", dto)
      .then((res) => res.data),

  modifica: (id: string, dto: NewProdottoDTO) =>
    axiosInstance
      .put<ProdottoRespDTO>(`/prodotti/${id}`, dto)
      .then((res) => res.data),

  elimina: (id: string) =>
    axiosInstance.delete<void>(`/prodotti/${id}`).then((res) => res.data),
};
