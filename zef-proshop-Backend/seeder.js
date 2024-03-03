// import connectDb from "./config/connectDb";
import mongoose from 'mongoose';
import products from "./data/products.js";
import users from "./data/users.js";
import UserModel from "./models/userModel.js";
import ProductModel from "./models/productModel.js";
import OrderModel from './models/orderModel.js';
import colors from "colors";
import dotenv from "dotenv";
import connectDb from "./config/connectDb.js";


dotenv.config();
connectDb();

const importData = async() => {
try {
  await OrderModel.deleteMany();
  await ProductModel.deleteMany();
  await UserModel.deleteMany();
  const createdUsers = await UserModel.insertMany(users);
  const adminUser = createdUsers[0]._id;
  const sampleProducts = await products.map(product => {
    return {...product , user : adminUser}
  });
  await ProductModel.insertMany(sampleProducts);
  console.log("data imported".green.inverse);
  process.exit();
} catch (error) {
  console.log(`${error}`.red.inverse);
  process.exit(1);
}
}



const destroyData = async () => {
  try {
    // await OrderModel.deleteMany();
    await ProductModel.deleteMany();
    await UserModel.deleteMany();
    console.log("data destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
}

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}


// importData();


