import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import productReducer from "./product.slice";
import categoryReducer from "./category.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
