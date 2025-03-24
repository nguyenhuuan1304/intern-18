// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// import { typeProduct } from "@/components/header/Header";
// import { api } from "@/hooks/useAxios";

// interface TypeList {
//   product: typeProduct[];
//   // editingPost: TypePost | null,
//   // loading: boolean,
//   // currentRequestId: undefined | string
// }
// const initialState: TypeList = {
//   product: [],
// };

// // First, create the thunk
// export const getPostList = createAsyncThunk(
//   "product/getPostList",
//   async (_, thunkAPI) => {
//     const response = await api.get<typeProduct[]>("products?populate=*", {
//       signal: thunkAPI.signal,
//     });
//     console.log(response.data);
//     return response.data.data;
//   }
// );

// export const productState = createSlice({
//   name: "product",
//   initialState,
//   reducers: {},
//   extraReducers(builder) {
//     builder.addCase(getPostList.fulfilled, (state, action) => {
//       state.product = action.payload;
//     });
//     // .addCase(getPostList.rejected, (state, action) => {
//     //     console.log(action)
//     // })
//   },
// });

// // Action creators are generated for each case reducer function
// // export const {} = counterSlice.actions

// export default productState.reducer;
