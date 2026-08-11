import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type {
  InsegnanteRespDTO,
  AggiornaInsegnanteDTO,
} from "@/interfaces/utente";

export interface FiltriInsegnanti {
  page?: number;
  size?: number;
}

export const insegnanteApi = {
  lista: (filtri: FiltriInsegnanti) =>
    axiosInstance
      .get<Page<InsegnanteRespDTO>>("/utenti/insegnanti", { params: filtri })
      .then((res) => res.data),

  ottieni: (id: string) =>
    axiosInstance
      .get<InsegnanteRespDTO>(`/utenti/insegnanti/${id}`)
      .then((res) => res.data),

  aggiorna: (id: string, dto: AggiornaInsegnanteDTO) =>
    axiosInstance
      .put<InsegnanteRespDTO>(`/utenti/insegnanti/${id}`, dto)
      .then((res) => res.data),

  disattiva: (id: string) =>
    axiosInstance
      .patch<InsegnanteRespDTO>(`/utenti/insegnanti/${id}/disattiva`)
      .then((res) => res.data),

  riattiva: (id: string) =>
    axiosInstance
      .patch<InsegnanteRespDTO>(`/utenti/insegnanti/${id}/riattiva`)
      .then((res) => res.data),
};
