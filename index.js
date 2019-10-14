require("dotenv").config();
const app = require("./app");
const env = app.get("env");

// if (app.get("env") === "development") {
//   PORT = 5000;
// }

// if(app.get("env") === "production"){
//   port = port.process.PORT
// }

const PORT = process.env.PORT || 5000;
console.log("PORT: ", PORT);

app.listen(PORT, () => {
  console.log(`App is now listening in Port ${PORT} in ${env} mode`);
});
