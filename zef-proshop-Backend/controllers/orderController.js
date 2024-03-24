import asyncHandler from "../middleware/asyncHandler.js";
import OrderModel from "../models/orderModel.js";


 /**---------------------------------------
 * @desc    add Order
 * @route   /api/v1/orders
 * @method  POST
 * @access  private 
 ----------------------------------------*/
 export const addOrderItems = asyncHandler(async (req , res , next) => {
   const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
   } = req.body;

   if (orderItems && orderItems.length === 0) { 
    return next(customErrorClass.create(`No order items` , 400))
   }

   const order = new OrderModel({
    orderItems : orderItems.map(x => ({
      ...x,
      product : x._id,
      _id : undefined
    })),
    user : req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
   })

   const createdOrder = await order.save();
   res.status(201).json(createdOrder);

 });

  /**---------------------------------------
 * @desc    get logged user orders
 * @route   /api/v1/orders/myorders
 * @method  GET
 * @access  private 
 ----------------------------------------*/
 export const getMyOrders = asyncHandler(async (req , res , next) => {
  const orders = await OrderModel.find({user : req.user._id});
  if (!orders) {
    return next(customErrorClass.create(`there's no orders for this user` , 400))
  }
  res.status(200).json(orders);
});

  /**---------------------------------------
 * @desc    get Order By Id
 * @route   /api/v1/orders/:id
 * @method  GET
 * @access  private 
 ----------------------------------------*/
 export const getOrderById = asyncHandler(async (req , res , next) => {
  const order = await OrderModel.findById(req.params.id).populate("user" , "name email");
  if (!order) {
    return next(customErrorClass.create(`there's no orders for this id ${req.params.id}` , 404))
  }
  res.status(200).json(order);
});


  /**---------------------------------------
 * @desc    update Order To Deliver
 * @route   /api/v1/orders/:id/deliver
 * @method  PUT
 * @access  private - admin
 ----------------------------------------*/
 export const updateOrderToDeliver = asyncHandler(async (req , res , next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(customErrorClass.create(`there's no orders for this id ${req.params.id}` , 404))
  }

  order.isDeliverd = true;
  order.deliverdAt = Date.now();

  order.save();
  res.status(200).json(order)
});


  /**---------------------------------------
 * @desc    update Order To Paid
 * @route   /api/v1/orders/:id/pay
 * @method  PUT
 * @access  private - admin 
 ----------------------------------------*/
 export const updateOrderToPaid = asyncHandler(async (req , res , next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(customErrorClass.create(`there's no orders for this id ${req.params.id}` , 404))
  }

  order.isPaid = true;
  order.paidAt = Date.now();


  order.paymentResult = {
    id : req.body.id,
    status : req.body.status,
    update_time : req.body.update_time,
    email_address : req.body.payer.email_address
}


  order.save();
  res.status(200).json(order)
});


  /**---------------------------------------
 * @desc    get all Orders
 * @route   /api/v1/orders
 * @method  GET
 * @access  private - admin 
 ----------------------------------------*/
 export const getOrders = asyncHandler(async (req , res , next) => {
const orders = await OrderModel.find({}).populate("user" , "_id  name");
res.status(200).json(orders)
});