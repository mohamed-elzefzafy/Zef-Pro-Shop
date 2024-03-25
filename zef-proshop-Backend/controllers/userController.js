import asyncHandler from "../middleware/asyncHandler.js";
import UserModel from "../models/userModel.js";
import customErrorClass from "../utils/customErrorClass.js";
import { generateToken } from "../utils/generateToken.js";
import { cloudinaryRemoveImage, cloudinaryUploadImage } from "../utils/cloudinary.js";



 /**---------------------------------------
 * @desc    login user
 * @route   /api/v1/users/login
 * @method  POST
 * @access  public 
 ----------------------------------------*/
 export const login = asyncHandler(async (req , res , next) => {
const {email , password} = req.body;
const user = await UserModel.findOne({email : email});
if (!user) {
  return next(customErrorClass.create(`invalid email or password` , 401))
}

const validPassword = await user.matchPassword(password);
if (!validPassword) {
  return next(customErrorClass.create(`invalid email or password` , 401))
}

generateToken(res , user._id);

res.status(200).json({
  _id : user._id,
  name : user.name,
  email : user.email,
  isAdmin : user.isAdmin,
  profilePhoto : user.profilePhoto
})
 }) 

 /**---------------------------------------
 * @desc    register user
 * @route   /api/v1/users/register
 * @method  POST
 * @access  public 
 ----------------------------------------*/
 export const register = asyncHandler(async (req , res , next) => {
const {name , email , password} = req.body;
const userExists = await UserModel.findOne({email : email});
if (userExists) {
  return next(customErrorClass.create(`user with this email is already exist` , 400))
}

const user = await UserModel.create({
name ,
email ,
password 
})

if (!user) {
  return next(customErrorClass.create(`invalid user data` , 400))
}


// upload profile photo to cloudinary 
// start 
if (req.file) {

  // upload the photo to cloudinary
  const result = await cloudinaryUploadImage(req.file.path);

  //  Change the profilePhoto field in the DB
  user.profilePhoto = {
    url : result.secure_url,
    public_Id : result.public_id
  }

  await user.save();


}
//finish


generateToken(res , user._id);

res.status(201).json({
  _id : user._id,
  name : user.name,
  email : user.email,
  isAdmin : user.isAdmin,
  profilePhoto : user.profilePhoto
});


 })


 /**---------------------------------------
 * @desc    logout user
 * @route   /api/v1/users/logout
 * @method  POST
 * @access  private 
 ----------------------------------------*/
 export const logout = asyncHandler(async (req , res) => {
   res.cookie("jwt" , "" , {
    httpOnly : true,
    expires : new Date(0),
   })

   res.status(200).json({message : "logged out successfully"});
 })

 /**---------------------------------------
 * @desc    get user profile
 * @route   /api/v1/users/profile
 * @method  GET
 * @access  private 
 ----------------------------------------*/
 export const getUserProfile = asyncHandler(async (req , res) => {
const user = await UserModel.findById(req.user._id);
if (!user) {
  return next(customErrorClass.create(`user not found` , 404))
}

res.status(200).json({
  _id : user._id,
  name : user.name,
  email : user.email,
  isAdmin : user.isAdmin,
  profilePhoto : user.profilePhoto
})
 })

  /**---------------------------------------
 * @desc    update user profile
 * @route   /api/v1/users/profile
 * @method  PUT
 * @access  private 
 ----------------------------------------*/
 export const updateUserProfile = asyncHandler(async (req , res) => {
  const {name , email , password} = req.body;
  const user = await UserModel.findById(req.user._id);
  if (!user) {
    return next(customErrorClass.create(`user not found` , 404))
  }

  user.name = name || user.name;
  user.email = email || user.email
  user.password = password || user.password

  if (req.file) {
    if (user.profilePhoto.publicId !== null) {
      await cloudinaryRemoveImage(user.profilePhoto.publicId)
    }
  // upload the photo to cloudinary
  const result = await cloudinaryUploadImage(req.file.path);

  //  Change the profilePhoto field in the DB
  user.profilePhoto = {
    url : result.secure_url,
    public_id : result.public_id
  }


  }

  await user.save();

  res.status(200).json({
    _id : user._id,
    name : user.name,
    email : user.email,
    isAdmin : user.isAdmin,
    profilePhoto : user.profilePhoto
  })
   })
   

     /**---------------------------------------
 * @desc    get users
 * @route   /api/v1/users
 * @method  GET
 * @access  private  - admin
 ----------------------------------------*/
 export const getUsers = asyncHandler(async (req , res) => {
  const users = await UserModel.find({}).sort("-isAdmin");
  res.status(200).json(users);
   })

     /**---------------------------------------
 * @desc    get one user
 * @route   /api/v1/users/:id
 * @method  GET
 * @access  private  - admin
 ----------------------------------------*/
 export const getOneUser = asyncHandler(async (req , res , next) => {
const user = await UserModel.findById(req.params.id).select("-password");
if (!user) {
  return next(customErrorClass.create(`user not found` , 404))
}

res.status(200).json(user);
   })

     /**---------------------------------------
 * @desc    delete user
 * @route   /api/v1/users/:id
 * @method  DELETE
 * @access  private  - admin
 ----------------------------------------*/
 export const deleteUser = asyncHandler(async (req , res , next) => {
  const user = await UserModel.findById(req.params.id).select("-password");
if (!user) {
  return next(customErrorClass.create(`user not found` , 404))
}
if (user.isAdmin) {
  return next(customErrorClass.create(`you can't delete admin` , 404))
}

if (user.profilePhoto.public_Id !== null) 
{
   await cloudinaryRemoveImage(user.profilePhoto.public_Id);
}

await user.deleteOne()
res.status(200).json("user deleted");

   })

//      /**---------------------------------------
//  * @desc    update user
//  * @route   /api/v1/users/:id
//  * @method  PUT
//  * @access  private  - admin
//  ----------------------------------------*/
//  export const updateUser = asyncHandler(async (req , res) => {
//   res.send("updateUser");
//    })