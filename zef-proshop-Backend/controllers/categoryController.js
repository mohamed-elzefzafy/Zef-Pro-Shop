import asyncHandler from "../middleware/asyncHandler.js";
import CategoryModel from "../models/categoryModel.js";
import ProductModel from "../models/productModel.js";
import { cloudinaryRemoveImage, cloudinaryRemoveMultipleImage, cloudinaryUploadImage } from "../utils/cloudinary.js";
import customErrorClass from "../utils/customErrorClass.js";

 /**---------------------------------------
 * @desc    get All Categories
 * @route   /api/v1/categories
 * @method  GET
 * @access  public 
 ----------------------------------------*/
 export const getAllCategories = asyncHandler(async (req , res) => {
  const categories = await CategoryModel.find().sort({name : "asc"});

  res.json(categories);
 })


  /**---------------------------------------
 * @desc    get one Category
 * @route   /api/v1/categories/:id
 * @method  GET
 * @access  public 
 ----------------------------------------*/
 export const getOneCategory = asyncHandler(async (req , res) => {
  const category = await CategoryModel.findById(req.params.id);

  res.json(category);
 })


 /**---------------------------------------
 * @desc    get posts count
 * @route   /api/v1/categories
 * @method  GET
 * @access  public 
 ----------------------------------------*/
 export const createCategory = asyncHandler(async (req , res , next) => {
const { name  } = req.body;
if (!name ) {
  res.status(400).json("category is required");
}
const categoryExist = await CategoryModel.findOne({name : name})
if (categoryExist) {
  res.status(400).json("category is already exist");
}

if (!req.file) {
  return next(customErrorClass.create(`category image is required` , 400))
}

const createdCategory = await CategoryModel.create({
  name 
});



// upload image photo to cloudinary 
// start 
if (req.file) {

  // upload the photo to cloudinary
  const result = await cloudinaryUploadImage(req.file.path);

  //  Change the image field in the DB
  createdCategory.image = {
    url : result.secure_url,
    public_Id : result.public_id
  }
  await createdCategory.save();


}
//finish




  res.status(201).json(createdCategory)


 })

  /**---------------------------------------
 * @desc    delete Category
 * @route   /api/v1/categories/:categoryId
 * @method  DELETE
 * @access  private 
 ----------------------------------------*/
 export const deleteCategory = asyncHandler(async (req , res) => {
  let category = await CategoryModel.findById(req.params.categoryId);
  if (!category) {
    res.status(400).json("ther's no category with this Id");
  }
  if (category.image ) 
  {
     await cloudinaryRemoveImage(category.image.public_Id);
  }

  const productsForCategory = await ProductModel.find({category : req.params.categoryId});
// const publicIds = productsForCategory.map(product => product.images.public_id);
// let publicIds = [];
console.log(productsForCategory);
let publicIds = productsForCategory.map(product => product.images.map(image => image.public_id))
console.log(publicIds);

if (publicIds?.length > 0) {
  for(let i = 0; i< publicIds.length ; i++)
  {
    await cloudinaryRemoveMultipleImage(publicIds[i])
  }
  
}

  await ProductModel.deleteMany({category : req.params.categoryId});

 category = await CategoryModel.findByIdAndDelete(req.params.categoryId);
  res.status(200).json({message : "Category deleted successfully" , categoryId : req.params.categoryId});

 })



 