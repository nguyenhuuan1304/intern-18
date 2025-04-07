import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Order {
  id: string;
  orderId: string;
  total_price: number;
  createdAt: string;
  status_order: string;
  email: string;
  phone_number: string;
  address_shipping: string;
  note?: string;
  [key: string]: any;
}
export interface OrderDetailItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrdersState {
  orders: Order[];
  ordersLoading: boolean;
  ordersError: string | null;
  orderDetail: OrderDetailItem[] | null;
  orderDetailLoading: boolean;
  orderDetailError: string | null;
}

const initialState: OrdersState = {
  orders: [],
  ordersLoading: false,
  ordersError: null,
  orderDetail: null,
  orderDetailLoading: false,
  orderDetailError: null,
};

export const fetchOrdersByEmail = createAsyncThunk<
  Order[],
  string, // Payload: email (string)
  { rejectValue: string }
>("order/fetchOrdersByEmail", async (email, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `http://localhost:1337/api/orders?filters[email][$eq]=${email}`
    );
    const orderData: Order[] = res.data.data.reverse();
    return orderData;
  } catch (error: unknown) {
    let message = "Error fetching orders";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return rejectWithValue(message);
  }
});

export const fetchOrderDetail = createAsyncThunk<
  OrderDetailItem[],
  string,
  { rejectValue: string }
>("order/fetchOrderDetail", async (orderId, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `http://localhost:1337/api/order-items?filters[order][$eq]=${orderId}`
    );
    return response.data.data as OrderDetailItem[];
  } catch (error: unknown) {
    let message = "Error fetching order detail";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return rejectWithValue(message);
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrdersByEmail.pending, (state) => {
      state.ordersLoading = true;
      state.ordersError = null;
    });
    builder.addCase(fetchOrdersByEmail.fulfilled, (state, action) => {
      state.ordersLoading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchOrdersByEmail.rejected, (state, action) => {
      state.ordersLoading = false;
      state.ordersError = action.payload || action.error.message || null;
    });

    builder.addCase(fetchOrderDetail.pending, (state) => {
      state.orderDetailLoading = true;
      state.orderDetailError = null;
    });
    builder.addCase(fetchOrderDetail.fulfilled, (state, action) => {
      state.orderDetailLoading = false;
      state.orderDetail = action.payload;
    });
    builder.addCase(fetchOrderDetail.rejected, (state, action) => {
      state.orderDetailLoading = false;
      state.orderDetailError = action.payload || action.error.message || null;
    });
  },
});

export default orderSlice.reducer;
