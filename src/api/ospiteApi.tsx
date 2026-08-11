import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { OspiteRespDTO } from "@/interfaces/utente";

export interface FiltriOspiti {
  page?: number;
  size?: number;
}

export const ospiteApi = {
  lista: (filtri: FiltriOspiti) =>
    axiosInstance
      .get<Page<OspiteRespDTO>>("/utenti/ospiti", { params: filtri })
      .then((res) => res.data),

  ottieni: (id: string) =>
    axiosInstance
      .get<OspiteRespDTO>(`/utenti/ospiti/${id}`)
      .then((res) => res.data),
};
