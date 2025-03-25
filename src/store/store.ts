import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import productReducer from "./productSlice";
import ratingReducer from "../store/ratingSlice";
import { useDispatch } from "react-redux";
import categoryReducer from "./category.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    rating: ratingReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
