import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { baseURL } from './../../utils/constants';


const baseQuery = fetchBaseQuery({baseUrl : baseURL});

export const apiSlice = createApi({
  baseQuery,
  tagTypes : ["Product", "Order" , "User"],
  endpoints : (builder) => ({}),
}) 