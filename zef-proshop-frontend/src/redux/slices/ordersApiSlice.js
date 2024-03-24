import { apiSlice } from './apiSlice';

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints : (builder) => ({
    createOrder : builder.mutation({
    query : (order) => ({
      url : `/api/v1/orders`,
      method : 'POST',
      body : {...order}
    })  
    }),

    getOneOrder : builder.query({
      query : (id) => ({
        url : `/api/v1/orders/${id}`,
      }),  
      keepUnusedDataFor : 5
      }),
      payOrder : builder.mutation({
        query : ({id , details}) => ({
          url : `/api/v1/orders/${id}/pay`,
          method : "PUT",
          body : details
        }),  
        keepUnusedDataFor : 5
        }),
        getPayPalClientId : builder.query({
          query : () => ({
            url : "/api/config/paypal",
          }),
          keepUnusedDataFor : 5 
        }),
        getMyOrders : builder.query({
          query : () => ({
            url : "/api/v1/orders/myorders",
          }),
          keepUnusedDataFor : 5 
        }),
        getOrders : builder.query({
          query : () => ({
            url : "/api/v1/orders",
          }),
          keepUnusedDataFor : 5 
        }),
        updateOrderToDeliver : builder.mutation({
          query : (id) => ({
            url : `/api/v1/orders/${id}/deliver`,
            method : 'PUT'
          })
        })
  })
})


export const {useCreateOrderMutation , useGetOneOrderQuery ,
   usePayOrderMutation , useGetPayPalClientIdQuery
    , useGetMyOrdersQuery , useGetOrdersQuery , useUpdateOrderToDeliverMutation} = orderApiSlice;