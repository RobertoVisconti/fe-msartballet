import axiosInstance from "./axiosInstance";
import type {
  LoginDTO,
  LoginRespDTO,
  AttivazioneAccountDTO,
  RichiestaResetPasswordDTO,
  ResetPasswordDTO,
  NewAllievoDTO,
  NewInsegnanteDTO,
  NewAdminDTO,
} from "@/interfaces/auth";

import type {
  AllievoRespDTO,
  InsegnanteRespDTO,
  AdminRespDTO,
} from "@/interfaces/utente";

export const authApi = {
  login: (dto: LoginDTO) =>
    axiosInstance
      .post<LoginRespDTO>("/auth/login", dto)
      .then((res) => res.data),

  creaAllievo: (dto: NewAllievoDTO) =>
    axiosInstance
      .post<AllievoRespDTO>("/auth/admin/allievi", dto)
      .then((res) => res.data),

  creaInsegnante: (dto: NewInsegnanteDTO) =>
    axiosInstance
      .post<InsegnanteRespDTO>("/auth/admin/insegnanti", dto)
      .then((res) => res.data),

  creaAdmin: (dto: NewAdminDTO) =>
    axiosInstance
      .post<AdminRespDTO>("/auth/admin/admins", dto)
      .then((res) => res.data),

  attivaAccount: (dto: AttivazioneAccountDTO) =>
    axiosInstance
      .post<LoginRespDTO>("/auth/attiva-account", dto)
      .then((res) => res.data),

  passwordDimenticata: (dto: RichiestaResetPasswordDTO) =>
    axiosInstance
      .post<void>("/auth/password-dimenticata", dto)
      .then((res) => res.data),

  reinviaAttivazione: (dto: RichiestaResetPasswordDTO) =>
    axiosInstance
      .post<void>("/auth/reinvia-attivazione", dto)
      .then((res) => res.data),

  resetPassword: (dto: ResetPasswordDTO) =>
    axiosInstance
      .post<LoginRespDTO>("/auth/reset-password", dto)
      .then((res) => res.data),
};
