import productRoute from "./productRoutes.js";
import userRoute from "./userRoutes.js";
import orderRoute from "./orderRoutes.js";
import categoryRoute from "./categoryRoute.js";
import reviewsRoute from "./reviewRoutes.js";

const mountRoutes = (app) => {
app.use("/api/v1/products" , productRoute);
app.use("/api/v1/users" , userRoute);
app.use("/api/v1/orders" , orderRoute);
app.use("/api/v1/categories" , categoryRoute);
app.use("/api/v1/reviews" , reviewsRoute);
}


export default mountRoutes;