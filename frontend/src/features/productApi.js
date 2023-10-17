import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
reducerPath: "productApi",
baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/"}),
endpoints: (builder)=>({
    getSingleProduct: builder.query({
        query: (productId) => `products/${productId}`,
      }),
}),
});

const { data: singleProductData, error: singleProductError } = useGetSingleProductQuery(productId);


export const { useGetSingleProductQuery } = productApi;