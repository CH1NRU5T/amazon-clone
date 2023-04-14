const express = require(`express`);
const authRouter = express.Router();
const auth = require(`../middlewares/auth`);
const bcryptjs = require(`bcryptjs`);
const User = require(`../models/user`);
const jwt = require(`jsonwebtoken`);
authRouter.post(`/api/signup`, async (req, res) => {
  console.log(`signup route hit`);
  try {
    const { name, email, password, type } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: `User already exists` });
    }

    let hashedPassword = await bcryptjs.hash(password, 10);

    let user = new User({
      name,
      email,
      password: hashedPassword,
      type,
    });
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
authRouter.post(`/api/signin`, async (req, res) => {
  console.log(`signin route hit`);

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: `User with this email does not exist` });
    }

    let isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: `Incorrect Password` });
    }

    const token = jwt.sign({ id: user._id }, `passwordKey`);

    res.status(200).json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
authRouter.post(`/tokenIsValid`, async (req, res) => {
  console.log(`tokenIsValid route hit`);
  try {
    const token = req.header(`x-auth-token`);
    if (!token) return res.json(false);
    const verified = jwt.verify(token, `passwordKey`);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authRouter.get(`/`, auth, async (req, res) => {
  console.log(`get user route hit`);
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});

module.exports = authRouter;
