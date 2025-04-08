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
 
// Cập nhật số lượng sản phẩm theo documentId
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({ documentId, quantity }: { documentId: string; quantity: number }, { rejectWithValue }) => {
        try {
            console.log("Updating cart item:", { documentId, quantity });
 
            await api.put(`/carts/${documentId}`, {
                data: { quantity },
            });
 
            return { documentId, quantity };
        } catch (error: any) {
            console.error("Lỗi khi cập nhật số lượng:", error.response?.data);
            return rejectWithValue(error.response?.data?.message || "Lỗi khi cập nhật số lượng");
        }
    }
);
 
// xóa sản phẩm khỏi giỏ hàng theo documentId
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
            return rejectWithValue(error.response?.data?.message || "Lỗi khi xóa sản phẩm");
        }
    }
);
 
export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/carts?populate=*");
            return response.data.data.map((item: any) => ({
                documentId: item.documentId,
                name: item.name || "N/A",
                size: item.size || "N/A",
                quantity: item.quantity || 0,
                price: item.price || 0,
                image: item.image || "",
                products: item.products?.map((p: any) => ({
                    documentId: p.documentId,
                    name: p.name || "N/A",
                })) || [],
            }));
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi lấy giỏ hàng");
        }
    }
);
 
export const addToCartApi = createAsyncThunk(
    "cart/addToCart",
    async (cartItem: CartItem & { products: any[] }, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState() as { cart: CartState };
 
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
            // Lấy giỏ hàng
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
                state.error = typeof action.payload === "string" ? action.payload : "Lỗi không xác định";
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
                state.error = typeof action.payload === "string" ? action.payload : "Lỗi không xác định";
            })
            // cập nhật số lượng
            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                const { documentId, quantity } = action.payload;
                state.items = state.items.map((item) =>
                    item.documentId === documentId ? { ...item, quantity } : item
                );
            })
            // xóa sản phẩm khỏi giỏ hàng
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.documentId !== action.payload);
            });
    },
});
 
export default cartSlice.reducer;