import { apiSlice } from "./apiSlice";

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints : (builder) => ({
    getCategories : builder.query({
      query : () => ({
        url : `/api/v1/categories`
      }),
      keepUnusedDataFor : 5
    }),
    createCategory : builder.mutation({
      query : (data) => ({
        url : `/api/v1/categories`,
        method : 'POST',
        body : data
      }),
  
    }),
    deleteCategory : builder.mutation({
      query : (id) => ({
        url : `/api/v1/categories/${id}`,
        method : "DELETE",
      }),
  
    }),
    getOneCategory : builder.query({
      query : (id) => ({
        url : `/api/v1/categories/${id}`,
        method : "DELETE",
      }),
      keepUnusedDataFor : 5
    }),



  
  })
})


export const {useGetCategoriesQuery , useCreateCategoryMutation ,
   useDeleteCategoryMutation , useGetOneCategoryQuery} = categoriesApiSlice