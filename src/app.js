const router = require("./routes");
const express = require("express");
const connectDB = require("../utils/database");
async function getExpressApp() {
  connectDB();
  const app = express();
  const ROUTE_PREFIX = "/api";

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use(ROUTE_PREFIX, router);

  return app;
}

module.exports = getExpressApp;
