const express = require("express");
const Order = require("../models/Order.model");
const OrderRouter = express.Router();
require("dotenv").config();
OrderRouter.get("/",(req,res)=>{
    res.send("Orders")
})
OrderRouter.get("/:id",async(req,res)=>{
    const id = req.params.id;
    const order = await Order.findById({_id:id});
    res.send(order);
})
OrderRouter.patch("/:id",async(req,res)=>{
    const id = req.params.id;
    const {status} = req.body;
    console.log(status);
    const order = await Order.findByIdAndUpdate({_id:id},{status:status});
    if(!order){
        res.send("Order not Found")
    }
    res.send(order);
})
OrderRouter.post("/",async(req,res)=>{
    try {
        const userId = req.body.userID;
        const { restaurant, items, deliveryAddress } = req.body;
        const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const order = new Order({
          user: userId,
          restaurant: restaurant,
          items,
          totalPrice,
          deliveryAddress,
          status: 'placed',
        });

        await order.save();
        res.send("Your Order Has Been Placed");
      } catch (error) {
        console.error(error);
        res.json({ error: 'Problem with create order' });
      }
})
module.exports={
    OrderRouter
}