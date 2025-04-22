import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.slice";
import { useDispatch } from "react-redux";
import categoryReducer from "./category.slice";
import newsReducer from "./news.slice";
import productReducer from "./productSlice";
import ratingReducer from "../store/ratingSlice";
import cartReducer from "./cartSlice";
import checkoutReducer from "./checkout.slice.ts";
import orderReducer from "./order.slice.ts";
import userSlice from "./user.slice";
import inventoryReducer from "./inventorySlice";
import shippingReducer from "./shipping.slice.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    rating: ratingReducer,
    category: categoryReducer,
    news: newsReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    order: orderReducer,
    shipping: shippingReducer,
    user: userSlice,
    inventory: inventoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
