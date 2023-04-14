// Creating an API
// PACKAGE IMPORTS
const express = require("express");
const mongoose = require("mongoose");
// IMPORT FROM OTHER FILES
const authRouter = require(`./routes/auth`);
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
// INITIALIZATION
const app = express();
const PORT = 3000;

// CLIENT -> middleware -> SERVER -> CLIENT
// middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);
// CONNECTIONS
mongoose
  .connect("mongodb://0.0.0.0:27017")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(PORT, "0.0.0.0", (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
