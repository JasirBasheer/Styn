import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from 'react-redux';

import produtsReducer, { productsFetch } from "./features/produtsSlice";
import { productsApi } from './features/productsApi';
import cartReducer from './features/cartSlice';

const store = configureStore({
  reducer: {
    products: produtsReducer,
    cart: cartReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
   return getDefaultMiddleware().concat(productsApi.middleware)
  }
});

store.dispatch(productsFetch())

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
);

