import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/connectDb.js";
import mountRoutes from "./routes/mountRoutes.js";
import { errorHandler, notFound } from "./middleware/erroeMiddleware.js";
dotenv.config();



const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;
connectDb();
app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true
  })
);


  // enable other domains accsess the app
  // app.use(cors());
  // app.options("*" , cors());

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });
  




app.get('/', (req , res) => {
  res.send("api is running...")
})

mountRoutes(app);
app.use(notFound);
app.use(errorHandler);
// const ProdSchema = new mongoose.Schema({
//   name : {
//     type : String
//   }
// })
// const prodModel = mongoose.model("Product" , ProdSchema)

// app.post("/api/products" , async(req , res) => {
//   const {name} = req.body
//   const productsss = await prodModel.create({
//     name : name
//   })
//   res.json(productsss);
// })

app.get("/api/products/:id" , (req , res) => {
  const product = products.find(prod => prod._id === req.params.id);
  res.json(product);
})
app.listen(port , ()=> {
  console.log(`app running on port ${port}`);
})