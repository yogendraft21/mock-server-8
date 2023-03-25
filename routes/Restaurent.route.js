const express = require("express");
const Restaurant = require("../models/Restaurent.model");
const RestaurentRouter = express.Router();
require("dotenv").config();
RestaurentRouter.get("/", async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
});
RestaurentRouter.post("/", async (req, res) => {
  const newRestaurant = new Restaurant(req.body);
  await newRestaurant.save();
  res.json(newRestaurant);
});
RestaurentRouter.get("/:id", async (req, res) => {
  const restaurants = await Restaurant.findOne({ _id: req.params.id });
  res.json(restaurants);
});
RestaurentRouter.get("/:id/menu", async (req, res) => {
  const { menu } = req.body;
  console.log(menu);
  const restaurants = await Restaurant.findOne({ _id: req.params.id });
  var Restau = restaurants.menu.filter((el) => {
    // console.log(el.name);
    return el.name === menu;
  });
  res.json(Restau);
});
RestaurentRouter.post("/:id/menu", async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    if (!restaurant) {
      return res.send({ error: "Restaurant not found" });
    }
    const newItem = { name, description, price, image };
    restaurant.menu.push(newItem);
    await restaurant.save();
    res.send(restaurant);
  } catch (err) {
    console.error(err);
    res.send({ error: "error" });
  }
});
RestaurentRouter.delete("/:id/menu/:menu_id", async (req, res) => {
  const menuId = req.params.menu_id;
  const restaurant = await Restaurant.findOne({ _id: req.params.id });
  if (restaurant) {
    const menuIndex = restaurant.menu.findIndex((item) => item._id == menuId);
    if (menuIndex === -1) {
      return res.send({ error: "Menu item not found" });
    }
    restaurant.menu.splice(menuIndex, 1);
    await restaurant.save();
    res.send("Deleted Succfully");
  }else{
    res.send({error:"Restaurent Not found"})
  }
});
module.exports = {
  RestaurentRouter,
};
