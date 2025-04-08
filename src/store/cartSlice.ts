import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/hooks/useAxios";
import { RootState } from "./store";
 
interface CartItem {
    documentId: string,
    name: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
    product: Product;
    products: { documentId: string | undefined }[];
}
 
interface CartState {
    items: CartItem[];
    loading: boolean;
    error: string | null;
}
 
interface Product {
    documentId: string;
    name: string;
}

interface User {
    documentId: string;
}

// Cập nhật số lượng sản phẩm theo documentId
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async (
      { documentId, quantity }: { documentId: string; quantity: number },
      { rejectWithValue }
    ) => {
      try {
        console.log("Updating cart item:", { documentId, quantity });
  
        await api.put(`/carts/${documentId}`, {
          data: { quantity },
        });
  
        return { documentId, quantity };
      } catch (error: any) {
        console.error("Lỗi khi cập nhật số lượng:", error.response?.data);
        return rejectWithValue(
          error.response?.data?.message || "Lỗi khi cập nhật số lượng"
        );
      }
    }
  );

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (documentId: string, { rejectWithValue }) => {
    try {
      console.log("Deleting cart item:", documentId);
      const response = await api.delete(`/carts/${documentId}`);

      if (response.status !== 200 && response.status !== 204) {
        throw new Error("Xóa không thành công");
      }
      return documentId;
    } catch (error: any) {
      console.error("Lỗi khi xóa sản phẩm:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi xóa sản phẩm"
      );
    }
  }
);


function getDocumentIdFromLocalStorage(): string | null {
    const currentUserString = localStorage.getItem('user');
    if (!currentUserString) {
        console.warn('Không tìm thấy thông tin người dùng trong localStorage.');
        return null;
    }
    try {
        const currentUser: User = JSON.parse(currentUserString);
        return currentUser.documentId || null;
    } catch (error) {
        console.error('Lỗi khi phân tích JSON:', error);
        return null;
    }
}

export const fetchCartItems = createAsyncThunk<CartItem[], void, { rejectValue: string }>(
    'cart/fetchCartItems',
    async (_, { rejectWithValue }) => {
        try {
            const documentId = getDocumentIdFromLocalStorage();
            if (!documentId) {
                return rejectWithValue('Không tìm thấy documentId của người dùng.');
            }

            const response = await api.get('/carts?populate=*');
            if (!response.data || !Array.isArray(response.data.data)) {
                return rejectWithValue('Dữ liệu trả về từ API không hợp lệ.');
            }

            const filteredItems = response.data.data.filter(
                (item: { users_permissions_user?: { documentId?: string } }) =>
                    item.users_permissions_user?.documentId === documentId
            );

            const cartItems: CartItem[] = filteredItems.map(
                (item: {
                    documentId: string;
                    name?: string;
                    size?: string;
                    quantity?: number;
                    price?: number;
                    image?: string;
                    products?: { documentId: string; name?: string }[];
                }) => ({
                    documentId: item.documentId,
                    name: item.name ?? 'N/A',
                    size: item.size ?? 'N/A',
                    quantity: item.quantity ?? 0,
                    price: item.price ?? 0,
                    image: item.image ?? '',
                    products:
                        item.products?.map((p) => ({
                            documentId: p.documentId,
                            name: p.name ?? 'N/A',
                        })) ?? [],
                })
            );

            return cartItems;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Lỗi khi lấy giỏ hàng.');
        }
    }
);


export const addToCartApi = createAsyncThunk(
    "cart/addToCart",
    async (cartItem: CartItem & { products: any[] }, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState() as { cart: CartState };
            const documentId = getDocumentIdFromLocalStorage();

            // Kiểm tra sản phẩm có cùng `name` & `size` trong giỏ hàng không
            const existingItem = state.cart.items.find(
                (item) => item.name === cartItem.name && item.size === cartItem.size
            );

            if (existingItem) {
                // Nếu đã có, cập nhật số lượng
                const newQuantity = existingItem.quantity + cartItem.quantity;
                await dispatch(updateCartItemQuantity({ documentId: existingItem.documentId, quantity: newQuantity }));

                return { ...existingItem, quantity: newQuantity };
            } else {
                // Nếu chưa có, thêm sản phẩm mới
                const response = await api.post("/carts", {
                    data: {
                        name: cartItem.name,
                        size: cartItem.size,
                        quantity: cartItem.quantity,
                        price: cartItem.price,
                        image: cartItem.image,
                        users_permissions_user: documentId,
                        products: cartItem.products.map((p) => p.documentId),
                    },
                });

                return {
                    documentId: response.data.data.id,
                    ...response.data.data.attributes,
                };
            }
        } catch (error: any) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error.response?.data);
            return rejectWithValue("Lỗi khi thêm vào giỏ hàng");
        }
    }
);

export const selectTotalItems = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0);
  
  const cartSlice = createSlice({
    name: "cart",
    initialState: {
      items: [],
      loading: false,
      error: null,
    } as CartState,
    reducers: {},
    extraReducers: (builder) => {
      builder
  
        .addCase(fetchCartItems.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCartItems.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(fetchCartItems.rejected, (state, action) => {
          state.loading = false;
          state.error =
            typeof action.payload === "string"
              ? action.payload
              : "Lỗi không xác định";
        })
        // Thêm vào giỏ hàng
        .addCase(addToCartApi.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
  
        .addCase(addToCartApi.fulfilled, (state, action) => {
          state.loading = false;
          const { name, size, quantity } = action.payload;
  
          const existingItem = state.items.find(
            (item) => item.name === name && item.size === size
          );
  
          if (existingItem) {
            existingItem.quantity = quantity;
          } else {
            state.items.push(action.payload);
          }
        })
  
        .addCase(addToCartApi.rejected, (state, action) => {
          state.loading = false;
          state.error =
            typeof action.payload === "string"
              ? action.payload
              : "Lỗi không xác định";
        })
  
        .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
          const { documentId, quantity } = action.payload;
          state.items = state.items.map((item) =>
            item.documentId === documentId ? { ...item, quantity } : item
          );
        })
  
        .addCase(removeCartItem.fulfilled, (state, action) => {
          state.items = state.items.filter(
            (item) => item.documentId !== action.payload
          );
        });
    },
  });
  
  export default cartSlice.reducer;