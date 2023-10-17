import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



const initialState = {
    product: null,
    status: null,
  };
  

  export const fetchSingleProduct = createAsyncThunk(
    "singleProduct/fetchSingleProduct",
    async (productId) => {
      const response = await axios.get(`http://localhost:5000/products/${productId}`);
      return response?.data;
    }
  );
  

  const singleProductSlice = createSlice({
    name: "singleProduct",
    initialState,
    reducers: {},
    extraReducers: {
      [fetchSingleProduct.pending]: (state, action) => {
        state.status = "pending";
      },
      [fetchSingleProduct.fulfilled]: (state, action) => {
        state.status = "success";
        state.product = action.payload;
      },
      [fetchSingleProduct.rejected]: (state, action) => {
        state.status = "rejected";
      },
    },
  });
  

  export default singleProductSlice.reducer;
