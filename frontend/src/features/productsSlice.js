import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  singleProduct: null,
  status: null,
};

export const productsFetch = createAsyncThunk("products/productsFetch", async () => {
  const response = await axios.get("http://localhost:5000/products");
  return response.data;
});

export const singleProductFetch = createAsyncThunk("products/singleProductFetch", async (productId) => {
  const response = await axios.get(`http://localhost:5000/products/${productId}`);
  return response.data;
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: {
    [productsFetch.pending]: (state) => {
      state.status = "pending";
    },
    [productsFetch.fulfilled]: (state, action) => {
      state.status = "success";
      state.items = action.payload;
    },
    [productsFetch.rejected]: (state) => {
      state.status = "rejected";
    },
    [singleProductFetch.pending]: (state) => {
      state.status = "pending";
    },
    [singleProductFetch.fulfilled]: (state, action) => {
      state.status = "success";
      state.singleProduct = action.payload;
    },
    [singleProductFetch.rejected]: (state) => {
      state.status = "rejected";
    },
  },
});

export default productsSlice.reducer;
