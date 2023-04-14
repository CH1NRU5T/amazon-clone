const express = require("express");
const auth = require("../middlewares/auth");
const productRouter = express.Router();
const { Product } = require("../models/product");
// api.products?category=Essentials
productRouter.get("/api/products", auth, async (req, res) => {
  const category = req.query.category;
  try {
    let products = await Product.find({ category: category });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

productRouter.get("/api/products/search/:name", auth, async (req, res) => {
  const category = req.params.name;
  try {
    let products = await Product.find({
      name: { $regex: req.params.name, $options: "i" },
    });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
productRouter.post("/api/products/rate-product", auth, async (req, res) => {
  console.log(`rate-product route hit`);
  const { id, rating } = req.body;
  try {
    let product = await Product.findById(id);
    for (let i = 0; i < product.ratings.length; i++) {
      if (product.ratings[i].userId == req.user) {
        product.ratings.splice(i, 1);
        break;
      }
    }
    const ratingSchema = {
      userId: req.user,
      rating,
    };
    product.ratings.push(ratingSchema);
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
productRouter.get("/api/deal-of-the-day", auth, async (req, res) => {
  console.log(`deal-of-the-day route hit`);
  try {
    let products = await Product.find();
    let maxRating = 0;
    let maxRatingProduct = products[0];
    for (let i = 0; i < products.length; i++) {
      let sum = 0;
      for (let j = 0; j < products[i].ratings.length; j++) {
        sum += products[i].ratings[j].rating;
      }
      if (sum > maxRating) {
        maxRating = sum;
        maxRatingProduct = products[i];
      }
    }

    res.json(maxRatingProduct);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
module.exports = productRouter;
