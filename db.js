const mongoose = require("mongoose");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const dbName = "kittens-db";
let dbUrl;
if (process.env.NODE_ENV === "development") {
  dbUrl = `mongodb://localhost/${dbName}`;
}
mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("We are now connected to MongoDB server!");
});
