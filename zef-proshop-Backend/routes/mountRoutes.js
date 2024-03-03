import productRoute from "./productRoutes.js";


const mountRoutes = (app) => {
app.use("/api/v1/products" , productRoute)
}


export default mountRoutes;