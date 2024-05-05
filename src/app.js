const router = require("./routes");
const express = require("express");
const connectDB = require("../utils/database");
const cors = require("cors");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
async function getExpressApp() {
  connectDB();
  const corsOptions = {
    origin: "*",
    // credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };
  const app = express();
  const ROUTE_PREFIX = "/api";

  app.use(cors(corsOptions));
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use(ROUTE_PREFIX, router);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = getExpressApp;
