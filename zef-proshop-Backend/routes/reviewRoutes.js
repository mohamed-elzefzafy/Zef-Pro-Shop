import express from "express";
import { verifyIsAdmin, verifyIsLoggedIn, verifyUserNotAdmin } from "../middleware/authMiddleware.js";
import { createReview, removeReviewByAdmin, removeReviewByLoggedUser, updateReview } from "../controllers/reviewController.js";
const router = express.Router();


// user 
router.use(verifyIsLoggedIn);
router.route("/:productId").put(verifyUserNotAdmin , createReview)
router.route("/delete-review/:productId").put(verifyUserNotAdmin , removeReviewByLoggedUser);
router.route("/update-review/:productId").put(verifyUserNotAdmin , updateReview);
// admin 
router.use(verifyIsAdmin);
router.route("/delete-review/admin/:productId").put(removeReviewByAdmin);

export default router;