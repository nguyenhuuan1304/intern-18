import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import { useDispatch } from "react-redux";
import categoryReducer from "./category.slice";
import newsReducer from "./news.slice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    news: newsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export default store;
