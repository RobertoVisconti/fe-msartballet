import axiosInstance from "./axiosInstance";
import type { ImmagineRespDTO } from "@/interfaces/utente";

export const uploadApi = {
  caricaFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance
      .post<ImmagineRespDTO>("/uploads/file", formData)
      .then((res) => res.data.url);
  },
};
