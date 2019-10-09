const express = require("express");
const router = express.Router();
const Kitten = require("../models/Kitten");

//TO RETURN ALL KITTENS
router.get("/", async (req, res, next) => {
  try {
    const kittens = await Kitten.find(req.query);
    res.send(kittens);
  } catch (err) {
    next(err);
  }
});

//TO RETURN ONLY A CERTAIN KITTEN
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

//TO CREATE A NEW KITTEN
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

module.exports = router;
