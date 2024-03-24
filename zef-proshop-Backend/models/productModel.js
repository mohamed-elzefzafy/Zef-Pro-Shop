import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  user : {
type : mongoose.Schema.Types.ObjectId,
required : true,
ref : "User",
  },
  name : {
    type : String,
    required : true
  },
  images : [],

  category : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Category",
    required : true,
  },
  description : {
    type : String,
    required : true,
  },
  reviews : [
    {
      comment : {
        type : String ,
        required : true
      },
      rating : {
        type : Number ,
        required : true
      },
      user : {
        userId : String,
        name : String,
        lastName : String,
        profilePhoto : Object
      } , 
      createdAt :Date,
    
    }
  ],
  rating : {
    type : Number,
    default :0
  },
  reviewsNumber : {
    type : Number,
  },
  price : {
    type : Number,
    required : true,
    default : 0,
  },
  countInStock : {
    type : Number,
    required : true,
    default : 0,
  },
},{timestamps:true});


const ProductModel = mongoose.model("Product" , ProductSchema);

export default ProductModel;