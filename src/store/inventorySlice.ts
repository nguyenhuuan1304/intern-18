import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/hooks/useAxios";

interface Product {
    documentId: string;
    name: string;
}

interface InventoryItem {
    product: Product;
    documentId: string;
    name: string;
    size: string;
    quantity: number;
}

interface CartItem {
    product: Product;
    documentId: string;
    name: string;
    size: string;
    quantity: number;
}

interface InventoryState {
    inventories: InventoryItem[];
    loading: boolean;
}

const initialState: InventoryState = {
    inventories: [],
    loading: false,
};

// Lấy dữ liệu kho từ API
export const fetchInventories = createAsyncThunk("inventory/fetchInventories", async () => {
    const response = await api.get("/inventories?populate=*");
    return response.data.data;
});

export const updateInventory = createAsyncThunk(
    "inventory/updateInventory",
    async (updatedQuantities: { documentId: string; quantity: number }[], { rejectWithValue }) => {
        try {
            console.log("Valid Updates:", updatedQuantities);

            await Promise.all(
                updatedQuantities.map((item) =>
                    api.put(`/inventories/${item.documentId}`, {
                        data: { quantity: item.quantity },
                    })
                )
            );

            return updatedQuantities;
        } catch (error) {
            return rejectWithValue("Lỗi khi cập nhật kho hàng!");
        }
    }
);



const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInventories.fulfilled, (state, action) => {
                state.inventories = action.payload;
            })
            .addCase(updateInventory.fulfilled, (state, action) => {
                state.inventories = state.inventories.map((inventoryItem) => {
                    const updatedItem = action.payload.find((item) => item.documentId === inventoryItem.documentId);
                    return updatedItem ? { ...inventoryItem, quantity: updatedItem.quantity } : inventoryItem;
                });
            });

    },
});

export default inventorySlice.reducer;
