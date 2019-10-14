const express = require("express");
const router = express.Router();
const Owner = require("../models/Owner");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(express.json());

const jwt = require("jsonwebtoken");

//To get all owners
router.get("/", async (_req, res, next) => {
  try {
    const owners = await Owner.find();
    res.send(owners);
  } catch (err) {
    next(err);
  }
});

router.get("/secret", (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error("Go away!");
    }
    console.log(req.cookies);
    const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    res.send(`Hello ${user.name}`);
  } catch (err) {
    err.status = 401;
    next();
  }
});

const protectedRoute = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error("Go away!");
    }
    req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    // err.status = 401;
    // next();
    res.status(401).end("You are not authorised ");
  }
};

router.get("/:username", protectedRoute, async (req, res, next) => {
  try {
    const username = req.params.username;
    const regex = new RegExp(username, "gi");
    const owners = await Owner.find({ username: regex });
    res.send(owners);
  } catch (err) {
    next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const owner = new Owner(req.body);
    await Owner.init();
    const newOwner = await owner.save();
    res.send(newOwner);
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const owner = await Owner.findOne({ username });
    const bcrypt = require("bcryptjs");
    const result = await bcrypt.compare(password, owner.password);

    if (!result) {
      throw new Error("Login failed, no such Username or Password is wrong");
    }

    const token = jwt.sign(
      { name: owner.username },
      process.env.JWT_SECRET_KEY
    );

    res.cookie("token", token);
    res.send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed") {
      err.status = 400;
    }
    next(err);
  }
});

module.exports = router;
