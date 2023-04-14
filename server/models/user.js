const mongoose = require("mongoose");
const { productSchema } = require("../models/product");
const userSchema = new mongoose.Schema({
  name: {
    required: [true, `Name is required`],
    type: String,
    trim: true,
  },
  email: {
    required: [true, `Email is required`],
    type: String,
    trim: true,
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(re);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    required: [true, `Password is required`],
    type: String,
    validate: {
      validator: (value) => {
        return value.length > 6;
      },
      message: `Password must be at least 6 characters long`,
    },
  },
  address: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "user",
  },
  // cart
  cart: [
    {
      product: productSchema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});
module.exports = mongoose.model("User", userSchema);
