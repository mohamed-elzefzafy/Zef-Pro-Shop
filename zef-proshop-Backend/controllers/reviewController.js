import ProductModel from "../models/productModel.js";
import customErrorClass from "../utils/customErrorClass.js";
import asyncHandler from './../middleware/asyncHandler.js';
import UserModel from './../models/userModel.js';


            /**---------------------------------------
 * @desc    create Review
 * @route   /api/v1/products/createreview/:productId
 * @method  PUT
 * @access  private  user
 ----------------------------------------*/
 export const createReview = asyncHandler(async (req , res , next) => {
  
  const product = await ProductModel.findById(req.params.productId);
  if (!product) {
    return next(customErrorClass.create(`there's no product with id (${req.params.productId})` , 400))
}
const user = await UserModel.findById(req.user._id);
  const existUser = product.reviews.find(review => (review.user.userId).toString() === (req.user._id).toString());
  if (existUser) {
    return next(customErrorClass.create(`your reviewd this product before` , 400))
  }

  const {comment , rating} = req.body;
  if (!comment || !rating ) {
    res.status(400).json(`all fields are required`);
  }

  if ( rating > 5 || rating < 0) {
    res.status(400).json(`rating must be between 0 and 5`);
  }
  
const review = {comment , rating ,
  createdAt : Date.now(),
   user : {
  userId : req.user._id,
  name : req.user.name,
  lastName : user.lastName,
  profilePhoto : user.profilePhoto.url
  
}};

product.reviews.push(review);

// await product.save();

let ratingToatal = 0;

product.reviews.forEach(review => {
 ratingToatal += +review.rating
})


 const productRating = Number(ratingToatal / product.reviews.length);


product.rating = +productRating;
product.reviewsNumber = product.reviews.length;

await product.save();

res.status(200).json({message :"review created successfully" , product});
   })



            /**---------------------------------------
 * @desc    delete Review
 * @route   /api/v1/reviews/:productId
 * @method  PUT
 * @access  private  user
 ----------------------------------------*/
 export const removeReviewByLoggedUser = asyncHandler(async (req , res , next) => {
  let product = await ProductModel.findById(req.params.productId)
  if (!product) {
    return next(customErrorClass.create(`there's no product with id (${req.params.id})` , 400))
}

const review = product.reviews.find(review => (review.user.userId).toString() === (req.user._id).toString());
const reviewId = review?._id;
console.log(review);
console.log(reviewId);
if ( !review || reviewId.toString() !== (req.query.reviewId).toString()) {
  return next(customErrorClass.create(`select the right review` , 400))
}


product = await ProductModel.findByIdAndUpdate({_id :req.params.productId},
  {$pull :{ reviews: {_id : req.query.reviewId}}},
  {new : true}
  )

  if (product.reviews.length === 0) {
    product.rating = 0;
  } else {
    let ratingToatal = 0;

    product.reviews.forEach(review => {
     ratingToatal += +review.rating
    })
    
    
     const productRating = Number(ratingToatal / product.reviews.length);
    
    
    product.rating = Number(productRating) ;
    product.reviewsNumber = product.reviews.length;
  }


  
  await product.save();


  res.status(200).json(product);
 })


 
            /**---------------------------------------
 * @desc    delete Review
 * @route   /api/v1/reviews/admin/:productId
 * @method  PUT
 * @access  private  user
 ----------------------------------------*/
 export const removeReviewByAdmin = asyncHandler(async (req , res) => {
  let product = await ProductModel.findById(req.params.productId)
  if (!product) {
    return  res.status(400).json(`this no product with id ${req.params.id}`);
}

const review = product.reviews.find(review => review?._id.toString() === (req.query.reviewId).toString());

if (!review) {
  return  res.status(400).json(`ther's no review with this id`);
}

product = await ProductModel.findByIdAndUpdate({_id :req.params.productId},
  {$pull :{ reviews: {_id : req.query.reviewId}}},
  {new : true}
  )

  if (product.reviews.length === 0) {
    product.rating = 0;
  } else {
    let ratingToatal = 0;

    product.reviews.forEach(review => {
     ratingToatal += +review.rating
    })
    
    
     const productRating = Number(ratingToatal / product.reviews.length);
    
    
    product.rating = Number(productRating) ;
    product.reviewsNumber = product.reviews.length;
  }

  
  await product.save();


  res.status(200).json(product);
 })




            /**---------------------------------------
 * @desc    delete Review
 * @route   /api/v1/reviews/updatr-review/:productId
 * @method  PUT
 * @access  private  user
 ----------------------------------------*/
 export const updateReview = asyncHandler(async (req , res) => {
  let product = await ProductModel.findById(req.params.productId)
  if (!product) {
    return  res.status(400).json(`this no product with id ${req.params.id}`);
}

const review = product.reviews.find(review => review?._id.toString() === (req.query.reviewId).toString());
const reviewId = review?._id.toString();

if ( !review || reviewId !== req.query.reviewId) {
  return  res.status(400).json(`select the right review`);
}

review.comment = req.body.comment || review.comment;
review.rating = req.body.rating || review.rating;





 await product.save();


 let ratingToatal = 0;

 product.reviews.forEach(review => {
  ratingToatal += review.rating
 })
 
 
  const productRating = (ratingToatal / product.reviews.length);
 
 
 product.rating = productRating;
 product.reviewsNumber = product.reviews.length;
 
 await product.save();

  res.status(201).json(product);
 })





