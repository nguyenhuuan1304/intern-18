import { configureStore } from '@reduxjs/toolkit'
import productState from './slice'
import { useDispatch } from "react-redux";
import productReducer from "../store/productSlice";
import ratingReducer from "../store/ratingSlice";

export const store = configureStore({
  reducer: {
    product: productState,
    products: productReducer,
    rating: ratingReducer,
  },
})

//lấy RootState và appdispatch từ store 
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()