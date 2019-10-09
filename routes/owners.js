const express = require("express");
const router = express.Router();
const Owner = require("../models/owner");

router.get("/", async (req, res, next) => {
  try {
    const owners = await Owner.find();
    res.send(owners);
  } catch (err) {
    next(err);
  }
});

router.get("/:name", async (req, res, next) => {
  try {
    const name = req.params.name;
    const regex = new RegExp(name, "gi");
    const allOwners = await Owner.find({ name: regex });
    res.send(allOwners);
  } catch (err) {
    next(err);
  }
});

router.get("/:firstName", async (req, res, next) => {
  try {
    const firstName = req.params.firstName;
    const regex = new RegExp(firstName, "gi");
    const personByFirstName = await Owner.find({ firstName: regex });
    res.send(personByFirstName);
  } catch (err) {
    next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const owner = new Owner(req.body);
    await Owner.init();
    const savedOwner = await owner.save();
    res.send(savedOwner);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    next(err);
  }
});

module.exports = router;
