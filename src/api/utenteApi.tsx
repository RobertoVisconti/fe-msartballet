import axiosInstance from "./axiosInstance";
import type {
  UtenteMe,
  CambiaPasswordDTO,
  ImmagineRespDTO,
} from "@/interfaces/utente";

export const utenteApi = {
  me: () => axiosInstance.get<UtenteMe>("/utenti/me").then((res) => res.data),

  cambiaPassword: (dto: CambiaPasswordDTO) =>
    axiosInstance.put<void>("/utenti/me/password", dto).then((res) => res.data),

  caricaImgProfilo: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance
      .post<ImmagineRespDTO>("/utenti/me/img-profilo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },
};
