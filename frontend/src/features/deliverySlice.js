// deliverySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from './api';


const initialState = {
  deliveryData: null,
  status: "idle",
  error: null,
};

export const submitDeliveryData = createAsyncThunk(
  "delivery/submitDeliveryData",
  async (formData) => {
    const response = await axios.post(`${url}/delivery`, formData);
    return response.data;
  }
);

const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    setDeliveryData: (state, action) => {
      state.deliveryData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitDeliveryData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitDeliveryData.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(submitDeliveryData.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const { setDeliveryData } = deliverySlice.actions;
export default deliverySlice.reducer;
