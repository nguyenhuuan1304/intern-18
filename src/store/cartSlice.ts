// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// interface CartItem {
//     name: string;
//     size: string;
//     quantity: number;
//     price: number;
//     image: string;
// }

// interface CartState {
//     items: CartItem[];
//     loading: boolean;
//     error: string | null;
// }

// // Gọi API thêm sản phẩm vào giỏ hàng
// export const addToCartApi = createAsyncThunk(

//     "cart/addToCart",
//     async (cartItem: CartItem, { rejectWithValue }) => {
//         try {
//             const response = await axios.post("http://localhost:1337/api/carts?populate=*", {
//                 data: cartItem,
//             });
//             return response.data;
//         } catch (error) {
//             return rejectWithValue("Lỗi khi thêm vào giỏ hàng");
//         }
//     }
// );

// const cartSlice = createSlice({
//     name: "cart",
//     initialState: {
//         items: [],
//         loading: false,
//         error: null,
//     } as CartState,
//     reducers: {
//         setCartItems: (state, action) => {
//             state.items = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(addToCartApi.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(addToCartApi.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.items.push(action.payload);
//             })
//             .addCase(addToCartApi.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = typeof action.payload === "string" ? action.payload : "Lỗi không xác định";
//             });
//     },
// });

// export const { setCartItems } = cartSlice.actions;
// export default cartSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface CartItem {
    id: number;
    name: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
}

interface CartState {
    items: CartItem[];
    loading: boolean;
    error: string | null;
}

// Cập nhật số lượng sản phẩm
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({ id, quantity }: { id: number; quantity: number }, { rejectWithValue }) => {
        try {
            console.log("Updating cart item:", { id, quantity });

            // Tìm ID giỏ hàng theo filters vì /api/carts/:id không hoạt động
            const findResponse = await axios.get(`http://localhost:1337/api/carts?filters[id][$eq]=${id}`);
            if (!findResponse.data.data.length) {
                throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
            }

            const cartItemId = findResponse.data.data[0].id;

            const response = await axios.put(`http://localhost:1337/api/carts/${cartItemId}`, {
                data: { id, quantity },
            });

            return { id, quantity };
        } catch (error: any) {
            console.error("Lỗi khi cập nhật số lượng:", error.response?.data);
            return rejectWithValue(error.response?.data?.message || "Lỗi khi cập nhật số lượng");
        }
    }
);

// Xóa sản phẩm khỏi giỏ hàng
export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem",
    async (id: number, { rejectWithValue }) => {
        try {
            console.log("Deleting cart item:", id);

            // Gọi API DELETE trực tiếp thay vì tìm ID trước (nếu Strapi hỗ trợ)
            const response = await axios.delete(`http://localhost:1337/api/carts/${id}`);

            if (response.status !== 200 && response.status !== 204) {
                throw new Error("Xóa không thành công");
            }

            return id;
        } catch (error: any) {
            console.error("Lỗi khi xóa sản phẩm:", error.response?.data);
            return rejectWithValue(error.response?.data?.message || "Lỗi khi xóa sản phẩm");
        }
    }
);

// Gọi API lấy giỏ hàng
export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:1337/api/carts?populate=*");
            console.log("API response:", response.data);

            return response.data.data.map((item: any) => ({
                id: item.id,
                name: item.name || "N/A",
                size: item.size || "N/A",
                quantity: item.quantity || 0,
                price: item.price || 0,
                image: item.image || "",
            }));
        } catch (error: any) {
            console.error("Lỗi API:", error.response?.data);
            return rejectWithValue(error.response?.data?.message || "Lỗi khi lấy giỏ hàng");
        }
    }
);

// Gọi API thêm sản phẩm vào giỏ hàng
export const addToCartApi = createAsyncThunk(
    "cart/addToCart",
    async (cartItem: CartItem, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:1337/api/carts", {
                data: {
                    name: cartItem.name,
                    size: cartItem.size,
                    quantity: cartItem.quantity,
                    price: cartItem.price,
                    image: cartItem.image,
                },
            });
            return {
                id: response.data.data.id,
                ...response.data.data.attributes,
            };
        } catch (error: any) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error.response?.data);
            return rejectWithValue("Lỗi khi thêm vào giỏ hàng");
        }
    }
);

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
                state.items.push(action.payload);
            })
            .addCase(addToCartApi.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === "string" ? action.payload : "Lỗi không xác định";
            })

            .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
                const { id, quantity } = action.payload;
                state.items = state.items.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                );
            })

            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default cartSlice.reducer;
