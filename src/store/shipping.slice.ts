import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Kiểu dữ liệu cho 1 record shipping
export interface Shipping {
  shipping_status: string;
  id: number;
  attributes: {
    shipping_status: string;
    shipping_date: string;
    order: string;
  };
}

// Trạng thái của slice
interface ShippingState {
  shippings: Shipping[];
  currentStatus: string;
  statusByOrder: Record<string, string>;
  loading: boolean;
  error: string | null;
}

const initialState: ShippingState = {
  shippings: [],
  currentStatus: "",
  statusByOrder: {},
  loading: false,
  error: null,
};

// Async thunk: Fetch shipping by orderId
export const fetchShippingByOrder = createAsyncThunk<
  Shipping[],
  string,
  { rejectValue: string }
>("shipping/fetchByOrder", async (orderId, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:1337/api/shippings", {
      params: {
        "filters[order][$eq]": orderId,
        sort: ["shipping_date:desc"],
      },
    });
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// Async thunk: Update shipping status
export const updateShippingStatus = createAsyncThunk<
  { orderId: string; status: string },
  { orderId: string; newStatus: string },
  { rejectValue: string }
>(
  "shipping/updateStatus",
  async ({ orderId, newStatus }, { rejectWithValue }) => {
    try {
      console.log("data", orderId, newStatus);
      await axios.post("http://localhost:1337/api/shippings", {
        data: {
          order: orderId,
          shipping_status: newStatus,
          shipping_date: new Date().toISOString(),
        },
      });

      return { orderId, status: newStatus };
    } catch (error: any) {
      return rejectWithValue(error.message || "Unknown error");
    }
  }
);

// Slice
const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShippingByOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchShippingByOrder.fulfilled,
        (state, action: PayloadAction<Shipping[]>) => {
          state.loading = false;
          state.shippings = action.payload;
          state.currentStatus =
            action.payload.length > 0 ? action.payload[0].shipping_status : "";
        }
      )
      .addCase(fetchShippingByOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi không xác định";
      })
      .addCase(updateShippingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateShippingStatus.fulfilled,
        (state, action: PayloadAction<{ orderId: string; status: string }>) => {
          state.loading = false;
          state.statusByOrder[action.payload.orderId] = action.payload.status;
        }
      )
      .addCase(updateShippingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error updating shipping status";
      });
  },
});

export default shippingSlice.reducer;
