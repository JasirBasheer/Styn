import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from 'react-redux';

import produtsReducer, { productsFetch } from "./features/produtsSlice";
import { productsApi } from './features/productsApi';
import cartReducer, { getTotals } from './features/cartSlice';
import authReducer, { loadUser } from './features/authSlice';
import deliveryReducer from './features/deliverySlice';
// import singleProductReducer from './features/productSlice';


const store = configureStore({
  reducer: {
    products: produtsReducer,
    cart: cartReducer,
    auth: authReducer,
    delivary: deliveryReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
   return getDefaultMiddleware().concat(productsApi.middleware)
  }
});

store.dispatch(productsFetch());
store.dispatch(getTotals());
store.dispatch(loadUser(null));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
);

