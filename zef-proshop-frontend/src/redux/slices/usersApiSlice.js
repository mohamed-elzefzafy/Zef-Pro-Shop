import { apiSlice } from "./apiSlice";


export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints : (builder) => ({
    login : builder.mutation({
      query : (data) => ({
        url : `/api/v1/users/login`,
        method : "POST",
        body : data,
      })
    }),

    register : builder.mutation({
      query : (data) => ({
        url : `/api/v1/users/register`,
        method : "POST",
        body : data,
      })
    }),
    logout : builder.mutation({
      query : () => ({
      url : `/api/v1/users/logout`,
      method : "POST",
      })
    }),

    updateProfile : builder.mutation({
      query : (data) => ({
        url : `/api/v1/users/profile`,
        method : "PUT",
        body : data
      })
    }),
    getUsers : builder.query({
      query : () => ({
        url : `api/v1/users`,
      }),
      providesTags : ["Users"],
      keepUnusedDataFor : 5
    }),
    deleteUser : builder.mutation({
      query : (id) => ({
        url : `/api/v1/users/${id}`,
        method : "DELETE"
      }),
      invalidatesTags : ["Users"] // refresh the data
    })
  })
})


export const {useLoginMutation , useLogoutMutation , useRegisterMutation ,
   useUpdateProfileMutation , useGetUsersQuery , useDeleteUserMutation} = usersApiSlice;
