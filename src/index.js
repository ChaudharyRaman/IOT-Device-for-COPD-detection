const getExpressApp = require("./app");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 3000;
dotenv.config();
console.log(process.env.MONGODB_URI);
getExpressApp().then((app) => {
  app.listen(PORT, () => {
    console.log(`[Service listening on port ${PORT}!]`);
  });
});
