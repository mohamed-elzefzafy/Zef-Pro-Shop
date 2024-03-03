import asyncHandler from "../middleware/asyncHandler.js";
import ProductModel from "../models/productModel.js";
import customErrorClass from "../utils/customErrorClass.js";

 /**---------------------------------------
 * @desc    get products
 * @route   /api/v1/products
 * @method  GET
 * @access  public 
 ----------------------------------------*/
 export const getAllProducts = asyncHandler(async (req , res) => {
  const products = await ProductModel.find({});
  res.json(products);
 })


 /**---------------------------------------
 * @desc    get one product
 * @route   /api/v1/products/:id
 * @method  GET
 * @access  public 
 ----------------------------------------*/
 export const getOneProduct = asyncHandler(async (req , res , next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
return next(customErrorClass.create(`not found product for id ${req.params.id}` , 404))
  }
  res.json(product);
 })


