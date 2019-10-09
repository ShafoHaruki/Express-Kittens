const express = require("express");
const app = express();

console.log("What environment am I in?", process.env.NODE_ENV, app.get("env"));

//This is to connect to database
if (app.get("env") !== "test") {
  require("./db");
}

//For body parser
app.use(express.json());

const kittens = require("./routes/kittens");
app.use("/kittens", kittens);

const owners = require("./routes/owners");
app.use("/owners", owners);

module.exports = app;
