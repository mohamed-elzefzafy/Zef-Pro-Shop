import express from "express";
import { adminGetAllProducts, createProduct, deleteProduct, getAllProducts, getOneProduct, getTopProduct, removeOneImage, updateProduct } from "../controllers/productController.js";
import { verifyIsAdmin, verifyIsLoggedIn } from "../middleware/authMiddleware.js";
import photoUpload from "../middleware/photoUploadMiddleWare.js";
const router = express.Router();


router.route("/").get(getAllProducts);
router.route("/top").get(getTopProduct);
router.route("/:id").get(getOneProduct);
router.use(verifyIsLoggedIn);
router.use(verifyIsAdmin);
router.route("/admin/allproducts").get(adminGetAllProducts);
router.route("/").post( photoUpload.array("images" , 3) ,createProduct);
router.route("/:id").put( photoUpload.array("images" , 3) ,updateProduct);
router.route("/:id").delete(deleteProduct); 
router.route("/removeimage/:id").put(removeOneImage); 



export default router