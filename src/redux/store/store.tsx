import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import { collegaStoreAxios } from "@/api/axiosInstance";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

collegaStoreAxios(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
