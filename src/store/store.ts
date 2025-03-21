import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import  productState  from '../redux/slice'
import { useDispatch } from "react-redux";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    news: productState
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export default store;
