const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/health-check", (req, res) => {
  res.send("OK");
});

module.exports = router;
