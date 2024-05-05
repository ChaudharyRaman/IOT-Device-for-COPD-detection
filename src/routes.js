const { Router } = require("express");
const copdModel = require("./models/copd.model");
const protect = require("./middlewares/auth.middleware");
const expressAsyncHandler = require("express-async-handler");
const {
  signupAdmin,
  loginAdmin,
  getAuthUser,
} = require("./controllers/admin.controller");
const {
  addUser,
  getEmployeeByID,
  getAllEmployees,
  addCopdData,
} = require("./controllers/user.controller");
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

router.get("/copd-data", async (req, res) => {
  try {
    const data = await copdModel.find();
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ADMIN ROUTES

router.post("/signup", signupAdmin);

router.post("/login", loginAdmin);

router.get("/me", protect, getAuthUser);

// EMPLOYEE ROUTES
router.post("/add-employee", protect, addUser);

router
  .route("/employee/:id", addUser)
  .get(protect, getEmployeeByID)
  .post(protect, addUser);

router.route("/employee").get(protect, getAllEmployees);

router.route("/employee/:id/copd").post(addCopdData);

module.exports = router;
