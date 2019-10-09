const app = require("./app");
const PORT = 5000;

const env = app.get("env");

app.listen(PORT, () => {
  console.log(`App is now listening in Port ${PORT} in ${env} mode`);
});
