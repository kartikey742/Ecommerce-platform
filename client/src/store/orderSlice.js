import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  razorpayOrderId: null,
  isLoading: false,
  orderId: null,
  amount: null,
  currency: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('Sending order data:', orderData);
      
      const response = await fetch(
        "http://localhost:5000/api/shop/order/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      console.log('Response status:', response.status);
      
      // Parse JSON from response
      const data = await response.json();
      console.log('Parsed response data:', data);

      // Check if request was successful
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to create order');
      }

      return data; // Return parsed data, not response.data
    } catch (error) {
      console.error('Order creation error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, razorpayPaymentId, razorpaySignature, orderId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/shop/order/capture",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentId, razorpayPaymentId, razorpaySignature, orderId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to capture payment');
      }

      return data;
    } catch (error) {
      console.error('Payment capture error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/shop/order/list/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch orders');
      }

      return data;
    } catch (error) {
      console.error('Fetch orders error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/shop/order/details/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch order details');
      }

      return data;
    } catch (error) {
      console.error('Fetch order details error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Order created successfully:', action.payload);
        state.razorpayOrderId = action.payload.razorpayOrderId;
        state.orderId = action.payload.orderId;
        state.amount = action.payload.amount;
        state.currency = action.payload.currency;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.razorpayOrderId = null;
        state.orderId = null;
        state.amount = null;
        state.currency = null;
        console.error('Order creation rejected:', action.payload);
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        console.error('Fetch orders rejected:', action.payload);
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
        console.error('Fetch order details rejected:', action.payload);
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;