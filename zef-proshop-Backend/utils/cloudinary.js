import cloudinary from "cloudinary";
// import path from "path";
import dotenv from "dotenv";
dotenv.config({path : "./config.env"});


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// cloudinary upload image
export const cloudinaryUploadImage = async(fileUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileUpload , {  resource_type : "auto"  }  , {
      folder: "Zef-Proshop",
    })
    return data;
    
  } catch (error) {
    console.log(error);
  throw new Error("internal server error cloudinary" )
  }
}

// cloudinary Remove image
export const cloudinaryRemoveImage = async(ImagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(ImagePublicId)
    return result;
    
  } catch (error) {
    console.log(error);
    throw new Error("internal server error cloudinary" )
  }
}



// cloudinary Remove multiple image
export const cloudinaryRemoveMultipleImage = async(publicIds) => {
  try {
    const result = await cloudinary.v2.api.delete_resources(publicIds)
    return result;
    
  } catch (error) {
    console.log(error);
    throw new Error("internal server error cloudinary" )
  }
}


// export { cloudinaryUploadImage , cloudinaryRemoveImage , cloudinaryRemoveMultipleImage}





