// src/features/category/categorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/components/product/types/ProductType";
import axios from "axios";
import { CategoryResponse } from "@/components/product/types/Category.type";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("category/fetchCategories", async (_, thunkAPI) => {
  try {
    const response = await axios.get<CategoryResponse>(
      "http://localhost:1337/api/categories?populate=children&pagination[limit]=1000"
    );
    const parentCategories = response.data.data.filter(
      (category) => category.children && category.children.length > 0
    );
    return parentCategories;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Lấy danh mục thất bại"
    );
  }
});

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lấy danh mục thất bại";
      });
  },
});

export default categorySlice.reducer;
