import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints : (builder) => ({
    adminGetProducts : builder.query({
      query : () => ({
        url : `/api/v1/products/admin/allproducts`
      }),
      keepUnusedDataFor : 5,
      providesTags: ["Products"]
    }),
    getProducts : builder.query({
      query : ({keyWord ,pageNumber}) => ({
        url : `/api/v1/products`,
        params : {
          keyWord ,
          pageNumber
        }
      }),
      keepUnusedDataFor : 5,
      providesTags: ["Products"]
    }),

    getOneProduct : builder.query({
      query : (productId) => ({
        url : `/api/v1/products/${productId}`
      }),
      keepUnusedDataFor : 5
    }),
    createProduct : builder.mutation({
      query : (data) => ({
        url : `/api/v1/products`,
        method : 'POST',
        body : data
      }),
      invalidatesTags : ['Product'] // refresh the data
    }),
    updateProduct : builder.mutation({
      query : (id , data) => ({
        url : `/api/v1/products/${id}`,
        method : 'PUT',
        body : data
      }),
      invalidatesTags : ['Products'] // refresh the data
    }),
    removeProductImage : builder.mutation({
      query : (id , data) => ({
        url : `/api/v1/products/removeimage/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags : ['Product'] // refresh the data
      
    }),
    deleteProduct : builder.mutation({
      query : (id) => ({
        url : `/api/v1/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags : ['Product'] // refresh the data
      
    }),
    getTopProducts : builder.query({
      query : () => ({
        url : `/api/v1/products/top`
      }),
      keepUnusedDataFor : 5,
      providesTags: ["Products"]
    }),


  })
})



export const { useAdminGetProductsQuery , useGetProductsQuery , useGetOneProductQuery , 
  useCreateProductMutation , useUpdateProductMutation  , useRemoveProductImageMutation ,
   useDeleteProductMutation , useGetTopProductsQuery} = productsApiSlice;