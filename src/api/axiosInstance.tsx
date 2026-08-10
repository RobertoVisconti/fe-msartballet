import axios from "axios";
import type { AppDispatch } from "@/redux/store/store";
import { leggiToken } from "@/utils/authStorage";

let dispatchRef: AppDispatch | null = null;

export function collegaStoreAxios(dispatch: AppDispatch): void {
  dispatchRef = dispatch;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = leggiToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      dispatchRef?.({ type: "auth/logout" });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
