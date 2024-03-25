import express from "express";
import { deleteUser, getOneUser, getUserProfile, getUsers, login, logout, register, updateUserProfile } from "../controllers/userController.js";
import { verifyIsAdmin, verifyIsLoggedIn } from "../middleware/authMiddleware.js";
import photoUpload from "../middleware/photoUploadMiddleWare.js";
const router = express.Router();


router.route("/login").post(login);
router.route("/register").post(photoUpload.single("profilePhoto") , register);
router.route("/logout").post(logout);

router.use(verifyIsLoggedIn);
router.route("/profile").get(getUserProfile).put( photoUpload.single("profilePhoto") , updateUserProfile);

router.use(verifyIsAdmin);
router.route("/").get(getUsers);
router.route("/:id").get(getOneUser).delete(deleteUser);





export default router