import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import customErrorClass from "../utils/customErrorClass.js";
import UserModel from "../models/userModel.js";

//protected roues
export const verifyIsLoggedIn = asyncHandler(async (req , res , next) => {
let token;
token = req.cookies.jwt;
if (token) {
try {
  const decoded = jwt.verify(token , process.env.JWT_SECRET);
   req.user =  await UserModel.findById(decoded.userId).select("-password");
next();
} catch (error) {
  console.log(error);
  return next(customErrorClass.create(`Not authorize  Token failed` , 401))
}
} else {
  return next(customErrorClass.create(`Not authorize No Token` , 401))
}
})


//admin middleware

export const verifyIsAdmin = asyncHandler(async (req , res , next) => {
if (req.user.isAdmin) {
  next();
} else {
  return next(customErrorClass.create(`Not authorized as admin` , 401))
}
})



export const verifyUserNotAdmin = asyncHandler(async (req , res , next) => {
  if (!req.user.isAdmin) {
    next();
  } else {
    return next(customErrorClass.create(`admin can't access this route` , 401))
  }
  })
  