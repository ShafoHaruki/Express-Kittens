const express = require("express");
const app = express();
const cors = require("cors");
// app.use(cookieParser());

console.log("What environment am I in?", process.env.NODE_ENV, app.get("env"));

//This is to connect to database
if (app.get("env") !== "test") {
  require("./db");
}

const corsOptions = {
  credentials: true,
  allowedHeaders: "content-type",
  origin: "http://localhost:3000"
  // methods: "DELETE"
  // preflightContinue: true
};
app.use(cors(corsOptions));

// //My front-end app uses PORT 3000
// app.use((req, res, next) => {
//   res.set("Access-Control-Allow-Headers", "content-type");
//   //To whitelist routes for CORS
//   res.set("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.set("Access-Control-Allow-Credentials", "true");
//   res.set("Access-Control-Allow-Methods", "DELETE");
//   next();
// });

//For body parser
app.use(express.json());

const kittens = require("./routes/kittens");
app.use("/kittens", kittens);

const owners = require("./routes/owners");
app.use("/owners", owners);

module.exports = app;
