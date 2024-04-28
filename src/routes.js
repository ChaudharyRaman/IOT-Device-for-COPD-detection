const { Router } = require("express");
const copdModel = require("./models/copd.model");
const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/health-check", (req, res) => {
  res.send("OK");
});

router.post("/copd", async (req, res) => {
  try {
    const { age, hasCOPD, copdData } = req.body;
    const newCOPD = new copdModel({ age, hasCOPD, copdData });
    await newCOPD.save();
    res.json(newCOPD);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
