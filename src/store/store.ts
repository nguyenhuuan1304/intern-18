import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
<<<<<<< HEAD
import  productState  from '../redux/slice'
import { useDispatch } from "react-redux";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    news: productState
=======
import productReducer from "./product.slice";
import categoryReducer from "./category.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
>>>>>>> dev
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export default store;
