// checkoutSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

export interface OptionType {
  label: string;
  value: number;
}

export interface CartItem {
  documentId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
}

export interface CheckoutPayload {
  cart: CartItem[];
  email: string;
  streetAddress: string;
  selectedWard: OptionType | null;
  selectedDistrict: OptionType | null;
  selectedProvince: OptionType | null;
  phoneNumber: string;
  note: string;
}

export interface CheckoutResponse {
  stripeSession: {
    id: string;
  };
}

export const checkoutOrder = createAsyncThunk<
  CheckoutResponse, // Kiểu trả về thành công
  CheckoutPayload, // Kiểu của payload
  { rejectValue: string } // Kiểu reject
>("checkout/checkoutOrder", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post<CheckoutResponse>(
      "http://localhost:1337/api/orders",
      {
        orders: payload.cart.map((item) => ({
          productId: item.documentId,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          size: item.size,
        })),
        email: payload.email,
        address: `${payload.streetAddress}, ${
          payload.selectedWard?.label || ""
        }, ${payload.selectedDistrict?.label || ""}, ${
          payload.selectedProvince?.label || ""
        }`.trim(),
        phoneNumber: payload.phoneNumber,
        note: payload.note,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = response.data;
    if (!data.stripeSession?.id) {
      return rejectWithValue("Failed to create Stripe session");
    }

    // Load Stripe và chuyển hướng đến trang thanh toán
    const stripe = await loadStripe(
      import.meta.env.VITE_STRIPE_PUBLIC_KEY as string
    );
    if (stripe) {
      const result = await stripe.redirectToCheckout({
        sessionId: data.stripeSession.id,
      });
      if (result.error) throw result.error;
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error occurred");
  }
});

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    // Nếu cần thêm reducer cho việc reset lỗi, v.v.
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(checkoutOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || null;
      });
  },
});

export const { resetError } = checkoutSlice.actions;
export default checkoutSlice.reducer;
