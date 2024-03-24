import asyncHandler from "../middleware/asyncHandler.js";
import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";
import customErrorClass from "../utils/customErrorClass.js";
import { cloudinaryRemoveMultipleImage, cloudinaryUploadImage } from './../utils/cloudinary.js';

 /**---------------------------------------
 * @desc    get products
 * @route   /api/v1/products/admin
 * @method  GET
 * @access  public 
 ----------------------------------------*/
 export const adminGetAllProducts = asyncHandler(async (req , res) => {
  const products = await ProductModel.find({}).populate("category" , "_id , name")
  res.json(products);
 })


  /**---------------------------------------
 * @desc    get products
 * @route   /api/v1/products
 * @method  GET
 * @access  public 
 ----------------------------------------*/
 export const getAllProducts = asyncHandler(async (req , res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const keyWord = req.query.keyWord ? {
    name :{ $regex : req.query.keyWord , $options : "i"}} : {}

  const count = await ProductModel.countDocuments({...keyWord});

  const products = await ProductModel.find({...keyWord}).populate("category" , "_id , name")
  .limit(pageSize).skip(pageSize * (page - 1));
  res.json({products , page , pages : Math.ceil(count / pageSize) });
 })


 /**---------------------------------------
 * @desc    get one product
 * @route   /api/v1/products/:id
 * @method  GET
 * @access  public 
 ----------------------------------------*/
 export const getOneProduct = asyncHandler(async (req , res , next) => {
  const product = await ProductModel.findById(req.params.id).populate("category" , "_id , name");
  if (!product) {
return next(customErrorClass.create(`not found product for id ${req.params.id}` , 404))
  }
  res.json(product);
 })


 /**---------------------------------------
 * @desc    create product
 * @route   /api/v1/products
 * @method  POST
 * @access  private  admin 
 ----------------------------------------*/
 export const createProduct = asyncHandler(async (req , res , next) => {
const {name , price  , category , description , countInStock }  = req.body;
// if (!name || !price || !category || !description || !countInStock || !req.file) {
//   return next(customErrorClass.create(`all fields are required` , 400))
// }

const productName = await ProductModel.findOne({name : name});
if (productName) {
  return next(customErrorClass.create(`product with this name (${name}) already exist` , 400))
}

let categoryExist= await CategoryModel.findOne({_id : category});
if (!categoryExist) {
  return next(customErrorClass.create(`this category not exist` , 400))
}



const product = await ProductModel.create({
  name , price  , category , description , countInStock , user : req.user._id
});


// start 

// let results = [];


// const files = req.files.map(file => formatImage(file));


// for (let file of files) {
//   const result =  await cloudinaryUploadImage(file);
// results.push(result);
// }

// let resultsArrayOfObjects = [];
//  results.map(oneResult => {
// resultsArrayOfObjects.push( {
//   url :  oneResult.url,
//   public_id : oneResult.public_id
// })
// })

// product.images = resultsArrayOfObjects;
// if (product.images.length === 0)
// {
//   return  res.status(400).json(`one image at least for product is required`);
// }


// await product.save();




 if (req.files || req.body.images) {
let results = [];

for (let file of req.files) {
  const result =  await cloudinaryUploadImage(file?.path);
results.push(result);
}

let resultsArrayOfObjects = [];
 results.map(oneResult => {
resultsArrayOfObjects.push( {
  url :  oneResult.url,
  public_id : oneResult.public_id
})
})

product.images = resultsArrayOfObjects;



await product.save();


// end
}




  res.status(201).json({message : "success" ,  product});
 })


 /**---------------------------------------
 * @desc    update product
 * @route   /api/v1/products/:id
 * @method  PUT
 * @access  private  admin 
 ----------------------------------------*/
 export const updateProduct = asyncHandler(async (req , res , next) => {
  const {name , price  , category , description , countInStock}  = req.body;
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return next(customErrorClass.create(`there's no product with id (${req.params.id})` , 400))
  }

  let categoryExist= await CategoryModel.findOne({_id : category});
if (!categoryExist) {
  return next(customErrorClass.create(`this category not exist` , 400))
}

  product.name = name || product.name;
  product.price = price || product.price;
  product.category = category || product.category;
  product.description = description || product.description;
  product.countInStock = countInStock || product.countInStock;
  

  // await product.save();

if (req.files) {
  
if (product.images.length > 0) {
  // Get the public ids from the images
  const public_ids = product.images?.map((image) => image.public_id)
  //  Delete all  images from cloudinary that belong to this product
if (public_ids?.length > 0) {
  await cloudinaryRemoveMultipleImage(public_ids)
}
}



let results = [];

for (let file of req.files) {
  const result =  await cloudinaryUploadImage(file?.path);
results.push(result);
}

let resultsArrayOfObjects = [];
 results.map(oneResult => {
resultsArrayOfObjects.push( {
  url :  oneResult.url,
  public_id : oneResult.public_id
})
})

product.images = resultsArrayOfObjects 



}

await product.save();
res.status(201).json({message : "success" ,  product});
 })



    /**---------------------------------------
 * @desc    Delete Product for Admin
 * @route   /api/v1/products/:id
 * @method  DELETE
 * @access  private admin
 ----------------------------------------*/
 export const deleteProduct = asyncHandler(async (req , res) => {
  let product = await ProductModel.findById(req.params.id);
  if (!product) {
    return next(customErrorClass.create(`there's no product with id (${req.params.id})` , 400))
  }


if (product.images.length > 0) {
      // Get the public ids from the images
        const public_ids = product.images?.map((image) => image.public_id)
      //  Delete all  images from cloudinary that belong to this product
      if (public_ids?.length > 0) {
        await cloudinaryRemoveMultipleImage(public_ids)
      }
}

  product = await ProductModel.findByIdAndDelete(req.params.id);

  res.status(200).json("product deleted successfully");
   })







            /**---------------------------------------
 * @desc    remove One Image for Admin
 * @route   /api/v1/products/removeimage/:id/:publicId
 * @method  PUT
 * @access  private 
 ----------------------------------------*/
 export const removeOneImage = asyncHandler(async (req , res) => {
const {publicId} = req.body;
  let product = await ProductModel.findById(req.params.id);

  if (!product) {
    return  res.status(400).json(`this no product with id ${req.params.id}`);
}



const  imageId  = product.images.find(img =>  img.public_id === publicId);
console.log(imageId);
if (!imageId) {
  return  res.status(400).json(`this image not exists`);
}

product = await ProductModel.findOneAndUpdate({_id : req.params.id} ,{$pull :
   {images : {public_id : req.body.publicId}}} , {new : true});

   await cloudinaryRemoveMultipleImage(imageId.public_id)

res.status(200).json(product)
 })


  /**---------------------------------------
 * @desc    get top rated product
 * @route   /api/v1/products/top
 * @method  GET
 * @access  public 
 ----------------------------------------*/
 export const getTopProduct = asyncHandler(async (req , res , next) => {
  const products = await ProductModel.find({}).sort({rating : -1}).limit(3);
  res.status(200).json(products);
 })

