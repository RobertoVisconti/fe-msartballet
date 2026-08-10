import axiosInstance from "./axiosInstance";
import type {
  LoginDTO,
  LoginRespDTO,
  OspiteRegistrazioneDTO,
  OspiteRespDTO,
  AttivazioneAccountDTO,
  RichiestaResetPasswordDTO,
  ResetPasswordDTO,
} from "@/interfaces/auth";

export const authApi = {
  login: (dto: LoginDTO) =>
    axiosInstance
      .post<LoginRespDTO>("/auth/login", dto)
      .then((res) => res.data),

  registraOspite: (dto: OspiteRegistrazioneDTO) =>
    axiosInstance
      .post<OspiteRespDTO>("/auth/register/ospite", dto)
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
