import express from "express";
import { verifyIsAdmin, verifyIsLoggedIn } from "../middleware/authMiddleware.js";
import { addOrderItems, getMyOrders, getOrderById, getOrders, updateOrderToDeliver, updateOrderToPaid } from "../controllers/orderController.js";
const router = express.Router();


router.use(verifyIsLoggedIn)
router.route("/").post(addOrderItems);
router.route("/myorders").get(getMyOrders);
router.route("/:id").get(getOrderById);
router.route("/:id/pay").put(updateOrderToPaid);

router.use(verifyIsAdmin)
router.route("/:id/deliver").put(updateOrderToDeliver);
router.route("/").get(getOrders);


export default router