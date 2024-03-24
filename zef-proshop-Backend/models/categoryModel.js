import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
name : {type : String , required : true , unique : true},
// description : {type : String , default : "default acategory description"},
image : {type : Object},
} , {timestamps: true});

// CategorySchema.index({description : 1})
const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;