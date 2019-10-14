const express = require("express");
const router = express.Router();
const Kitten = require("../models/Kitten");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res, next) => {
  try {
    const kittens = await Kitten.find(req.query);
    res.send(kittens);
  } catch (err) {
    next(err);
  }
});

router.get("/:name", async (req, res, next) => {
  try {
    const name = req.params.name;
    const regex = new RegExp(name, "gi");
    const allKittens = await Kitten.find({ name: regex });
    res.send(allKittens);
  } catch (err) {
    next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const kitten = new Kitten(req.body);
    await Kitten.init();
    const kittens = await kitten.save();
    res.send(kittens);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    next(err);
  }
});

router.put("/:name", async (req, res, next) => {
  try {
    const name = req.params.name;
    const query = { name };
    const newKitten = req.body;
    const kitten = await Kitten.findOneAndReplace(query, newKitten);
    res.send(kitten);
  } catch (err) {
    next(err);
  }
});

router.patch("/:name", async (req, res, next) => {
  try {
    const name = req.params.name;
    const updatedKitten = req.body;
    const query = { name };
    const kitten = await Kitten.findOneAndReplace(query, updatedKitten, {
      new: true
    });
    res.send(kitten);
  } catch (err) {
    next(err);
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
    res.status(401).end("You are not authorised ");
  }
};

router.delete("/:id", protectedRoute, async (req, res, next) => {
  try {
    const id = req.params.id;
    await Kitten.findByIdAndDelete(id);
    res.send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
