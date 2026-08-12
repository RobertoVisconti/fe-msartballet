import axiosInstance from "./axiosInstance";
import type { Page } from "@/interfaces/common";
import type { MediaRespDTO } from "@/interfaces/galleria";

export interface FiltriMedia {
  page?: number;
  size?: number;
}

export const mediaApi = {
  lista: (filtri: FiltriMedia) =>
    axiosInstance
      .get<Page<MediaRespDTO>>("/media", { params: filtri })
      .then((res) => res.data),
};
