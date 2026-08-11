import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { AllievoRespDTO, AggiornaAllievoDTO } from "@/interfaces/utente";

export interface FiltriAllievi {
  nome?: string;
  cognome?: string;
  accountAttivo?: boolean;
  certificatoScadeEntro?: string;
  page?: number;
  size?: number;
}

export const allievoApi = {
  lista: (filtri: FiltriAllievi) =>
    axiosInstance
      .get<Page<AllievoRespDTO>>("/utenti/allievi", { params: filtri })
      .then((res) => res.data),

  ottieni: (id: string) =>
    axiosInstance
      .get<AllievoRespDTO>(`/utenti/allievi/${id}`)
      .then((res) => res.data),

  aggiorna: (id: string, dto: AggiornaAllievoDTO) =>
    axiosInstance
      .put<AllievoRespDTO>(`/utenti/allievi/${id}`, dto)
      .then((res) => res.data),

  disattiva: (id: string) =>
    axiosInstance
      .patch<AllievoRespDTO>(`/utenti/allievi/${id}/disattiva`)
      .then((res) => res.data),

  riattiva: (id: string) =>
    axiosInstance
      .patch<AllievoRespDTO>(`/utenti/allievi/${id}/riattiva`)
      .then((res) => res.data),
};
