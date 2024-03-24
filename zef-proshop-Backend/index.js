import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/connectDb.js";
import mountRoutes from "./routes/mountRoutes.js";
import { errorHandler, notFound } from "./middleware/erroeMiddleware.js";
import cookieParser from "cookie-parser";
dotenv.config({path : "./config.env"});



const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

const port = process.env.PORT || 5000;
connectDb();


app.use(
  cors({
    credentials: true,
    origin: 'https://zef-proshop.web.app'
  })
);

// app.use(cors({ origin: 'https://zef-proshop.web.app' }));

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://zef-proshop.web.app/search/zefzafy');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });
  




app.get('/', (req , res) => {
  res.send("Zef-Proshop api is running...")
})

mountRoutes(app);

app.get("/api/config/paypal" , (req , res) => {
  res.send({ clientId : process.env.PAYPAL_CLIENT_ID});
})

app.use(notFound);
app.use(errorHandler);

app.get("/api/products/:id" , (req , res) => {
  const product = products.find(prod => prod._id === req.params.id);
  res.json(product);
})
app.listen(port , ()=> {
  console.log(`app running on port ${port}`);
})