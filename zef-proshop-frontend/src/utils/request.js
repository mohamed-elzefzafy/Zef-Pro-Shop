import axios from "axios";
import { baseURL } from "./constants";

const request = axios.create({
  baseURL ,
  withCredentials : true,
})


export default request;