import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { AdminRespDTO } from "@/interfaces/utente";

export interface FiltriAdmin {
  page?: number;
  size?: number;
}

export const adminApi = {
  lista: (filtri: FiltriAdmin) =>
    axiosInstance
      .get<Page<AdminRespDTO>>("/utenti/admins", { params: filtri })
      .then((res) => res.data),

  disattiva: (id: string) =>
    axiosInstance
      .patch<AdminRespDTO>(`/utenti/admins/${id}/disattiva`)
      .then((res) => res.data),

  riattiva: (id: string) =>
    axiosInstance
      .patch<AdminRespDTO>(`/utenti/admins/${id}/riattiva`)
      .then((res) => res.data),
};
