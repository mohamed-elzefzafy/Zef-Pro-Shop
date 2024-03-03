import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints : (builder) => ({
    getProducts : builder.query({
      query : () => ({
        url : `/api/v1/products`
      }),
      keepUnusedDataFor : 5
    }),

    getOneProduct : builder.query({
      query : (productId) => ({
        url : `/api/v1/products/${productId}`
      }),
      keepUnusedDataFor : 5
    })
  })
})



export const {useGetProductsQuery , useGetOneProductQuery} = productsApiSlice;