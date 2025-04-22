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
  size: string;
}

interface OrdersState {
  orders: Order[];
  shippingStatusByOrder: Record<string, string>;
  ordersLoading: boolean;
  ordersError: string | null;
  orderDetail: OrderDetailItem[] | null;
  orderDetailLoading: boolean;
  orderDetailError: string | null;
}

const initialState: OrdersState = {
  orders: [],
  shippingStatusByOrder: {},
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

export const fetchOrderByOrderId = createAsyncThunk<
  Order[],
  string,
  { rejectValue: string }
>("order/fetchOrderByOrderId", async (orderId, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `http://localhost:1337/api/orders?filters[orderId][$eq]=${orderId}`
    );
    return res.data.data; // hoặc ép kiểu: return res.data.data as Order[];
  } catch (error: unknown) {
    let message = "Error fetching order by orderId";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return rejectWithValue(message);
  }
});

export const updateOrderStatus = createAsyncThunk<
  Order,
  { documentId: string; status_order: string },
  { rejectValue: string }
>(
  "order/updateOrderStatus",
  async ({ documentId, status_order }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:1337/api/orders/${documentId}`,
        {
          data: {
            status_order,
          },
        }
      );

      console.log("res update status", res);
      return res.data.data as Order;
    } catch (error: unknown) {
      let message = "Error updating order status";
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const sendEmailOrder = createAsyncThunk<
  void,
  { orderId: string; type: string; orderItems: any[] },
  { rejectValue: string }
>(
  "order/sendEmailOrder",
  async ({ orderId, type, orderItems }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:1337/api/order/sendEmailOrder`,
        {
          order_id: orderId,
          type,
          order_items: orderItems,
        }
      );
      return;
    } catch (error: unknown) {
      let message = "Lỗi khi gửi email";
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      // Trả về message lỗi khi gặp sự cố
      return rejectWithValue(message);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { dispatch }) => {
    const response = await axios.get("http://localhost:1337/api/orders");
    const orders = response.data.data || [];
    for (const order of orders) {
      dispatch(fetchShippingStatus(order.orderId));
    }

    return orders;
  }
);

export const fetchShippingStatus = createAsyncThunk(
  "orders/fetchShippingStatus",
  async (orderId: string) => {
    try {
      const response = await axios.get("http://localhost:1337/api/shippings", {
        params: {
          "filters[order][$eq]": orderId,
          sort: ["shipping_date:desc"],
        },
      });

      const shippings = response.data.data;
      const latestStatus =
        shippings.length > 0 ? shippings[0].shipping_status : "PREPARING";
      return { orderId, latestStatus };
    } catch (error) {
      console.error(`❌ Error fetch shipping for ${orderId}:`, error);
      return { orderId, latestStatus: "PREPARING" };
    }
  }
);

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
    builder.addCase(fetchOrderByOrderId.pending, (state) => {
      state.ordersLoading = true;
      state.ordersError = null;
    });
    builder.addCase(fetchOrderByOrderId.fulfilled, (state, action) => {
      state.ordersLoading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchOrderByOrderId.rejected, (state, action) => {
      state.ordersLoading = false;
      state.ordersError = action.payload || action.error.message || null;
    });

    builder.addCase(updateOrderStatus.pending, (state) => {
      state.ordersLoading = true;
      state.ordersError = null;
    });
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      state.ordersLoading = false;
      const updatedOrder = action.payload;
      const index = state.orders.findIndex((o) => o.id === updatedOrder.id);
      if (index !== -1) {
        state.orders[index] = updatedOrder;
      }
    });
    builder
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload || action.error.message || null;
      })

      .addCase(sendEmailOrder.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null; // Reset lỗi khi gửi email bắt đầu
      })
      .addCase(sendEmailOrder.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = null;
        // Thêm hành động sau khi gửi email thành công (nếu cần)
      })
      .addCase(sendEmailOrder.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.payload as string;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.ordersLoading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError = action.error.message || "Failed to fetch orders";
      })

      .addCase(fetchShippingStatus.fulfilled, (state, action) => {
        const { orderId, latestStatus } = action.payload;
        state.shippingStatusByOrder[orderId] = latestStatus;
      });
  },
});

export default orderSlice.reducer;
