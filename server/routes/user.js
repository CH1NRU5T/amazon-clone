const express = require("express");
const auth = require("../middlewares/auth");
const { Product } = require("../models/product");
const User = require("../models/user");
const userRouter = express.Router();
userRouter.post("/api/add-to-cart", auth, async (req, res) => {
  console.log("add to cart route hit");
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);
    if (user.cart.length == 0) {
      user.cart.push({ product, quantity: 1 });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.toString() == id) {
          user.cart[i].quantity++;
          isProductFound = true;
          break;
        }
      }
      if (!isProductFound) {
        user.cart.push({ product, quantity: 1 });
      }
    }

    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

userRouter.delete("/api/remove-from-cart/:id", auth, async (req, res) => {
  console.log("remove from cart route hit");
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);
    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id == id) {
        if (user.cart[i].quantity == 1) {
          user.cart.splice(i, 1);
        } else {
          user.cart[i].quantity -= 1;
        }
      }
    }

    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

module.exports = userRouter;
