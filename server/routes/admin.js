const express = require("express");
const adminRouter = express.Router();
const admin = require("../middlewares/admin.js");
const { Product } = require("../models/product.js");
adminRouter.post("/admin/add-product", admin, async (req, res) => {
  console.log(`add product route hit`);
  try {
    const { name, description, images, quantity, price, category } = req.body;
    let product = new Product({
      name,
      description,
      images,
      quantity,
      price,
      category,
    });
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
adminRouter.get("/admin/get-products", admin, async (req, res) => {
  console.log(`get products route hit`);
  try {
    // find all the products
    const products = await Product.find({});
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
adminRouter.post("/admin/delete-product", admin, async (req, res) => {
  console.log(`delete product route hit`);
  try {
    const { id } = req.body;
    let product = await Product.findByIdAndDelete(id);
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
module.exports = adminRouter;
