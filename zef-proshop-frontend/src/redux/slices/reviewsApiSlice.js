import { apiSlice } from "./apiSlice";

export const reviewsApiSlice = apiSlice.injectEndpoints({
  endpoints : (builder) => ({
    createReview : builder.mutation({
      query : (data) => ({
        url : `/api/v1/reviews/${data.productId}`,
        method : "PUT",
        body : data,
      }),
      // invalidatesTags : ["Reviews"]
    }),
    updateReview : builder.mutation({
      query : (data) => ({
        url : `/api/v1/reviews/update-review/${data.productId}?reviewId=${data.reviewQuery}`,
        method : "PUT",
        body : data,
      }),
      invalidatesTags : ["Reviews"]
    }),
    deleteReview : builder.mutation({
      query : (data) => ({
        url : `/api/v1/reviews/delete-review/${data.productId}?reviewId=${data.reviewQuery}`,
        method : "PUT",
      }),
      invalidatesTags : ["Reviews"]
    }),
    deleteReviewByAdmin : builder.mutation({
      query : (data) => ({
        url : `/api/v1/reviews/delete-review/admin/${data.productId}?reviewId=${data.reviewQuery}`,
        method : "PUT",
      }),
      invalidatesTags : ["Reviews"]
    }),
  })
})



export const {useCreateReviewMutation , useUpdateReviewMutation ,
          useDeleteReviewMutation , useDeleteReviewByAdminMutation  } = reviewsApiSlice;