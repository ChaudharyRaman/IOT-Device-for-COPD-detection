const expressAsyncHandler = require("express-async-handler");
const userModel = require("../models/user.model");

const addUser = expressAsyncHandler(async (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) {
    res.status(400);
    throw new Error("Please Enter All the Fields");
  }

  const id = (await userModel.countDocuments()) + 1;

  const newUser = new userModel({
    id,
    name,
    age,
  });

  await newUser.save();
  res.json({
    id: newUser.id,
    name: newUser.name,
    age: newUser.age,
  });
});

const addCopdData = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { gasConcentration, gasType, nh3Concentration } = req.body;
  if (!gasConcentration || !gasType || !nh3Concentration) {
    res.status(400);
    throw new Error("Please Enter All the Fields");
  }
  const user = await userModel.findOne({ id });
  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }

  const date = new Date();
  user.copdHistory.push({ gasConcentration, gasType, nh3Concentration, date });
  await user.save();
  res.json(user);
});

const getEmployeeByID = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userModel
    .findOne({ id })
    .select("name age copdHistory id hasCOPD -_id");
  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }
  res.json(user);
});

const getAllEmployees = expressAsyncHandler(async (req, res) => {
  const users = await userModel
    .find()
    .select("id hasCOPD name age copdHistory -_id");
  res.json(users);
});

module.exports = { addUser, addCopdData, getEmployeeByID, getAllEmployees };
