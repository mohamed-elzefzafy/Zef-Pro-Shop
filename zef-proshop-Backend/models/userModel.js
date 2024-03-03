import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true,
  },
  email: {
    type : String,
    required : true,
    unique : true,
  },
  password: {
    type : String,
    required : true,
    minlength : 6 ,
  },
  profilePhoto: {
    type : Object,
  default : {
    url : "https://res.cloudinary.com/dw1bs1boz/image/upload/v1702487318/Zef-Blog/Default%20images/download_w26sr9.jpg",
    publicId : null
  }
  },
  isAdmin : {
    type : Boolean,
    required : true,
    default : false
    },

},{timestamps : true})



const UserModel = mongoose.model("User" , UserSchema);

export default UserModel;