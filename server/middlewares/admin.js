const User = require("../models/user");
const jwt = require("jsonwebtoken");
const admin = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({ message: "No auth token, access denied." });
    const verified = jwt.verify(token, `passwordKey`);
    if (!verified)
      return res
        .status(401)
        .json({ message: "Token verification failed, access denied." });

    const user = await User.findById(verified.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.type != "admin")
      return res.status(401).json({ message: "You are not an admin" });

    req.user = verified.id;
    req.token = token;
    next();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
module.exports = admin;
