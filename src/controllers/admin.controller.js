const expressAsyncHandler = require("express-async-handler");
const adminModel = require("../models/admin.model");
const generateToken = require("../config/generateToken");

const signupAdmin = expressAsyncHandler(async (req, res) => {
  const { name, email, password, company } = req.body;

  if (!name || !email || !password || !company) {
    res.status(400);
    throw new Error("Please Enter All the Fields");
  }
  const id = (await adminModel.countDocuments()) + 1;

  const adminExist = await adminModel.findOne({ email });
  if (adminExist) {
    res.status(400);
    throw new Error("User Already Exists");
  }
  const newAdmin = new adminModel({
    id,
    name,
    email,
    password,
    company,
  });

  await newAdmin.save();
  res.json({
    id: newAdmin.id,
    name: newAdmin.name,
    email: newAdmin.email,
    company: newAdmin.company,
    token: generateToken(newAdmin.id),
  });
});

const loginAdmin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminModel.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    res.json({
      token: generateToken(admin),
    });
  } else {
    res.status(401);
    throw new Error("Invalid User and Password");
  }
});

const getAuthUser = expressAsyncHandler(async (req, res) => {
  const admin = req.user;
  if (admin) {
    res.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      company: admin.company,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

module.exports = { signupAdmin, loginAdmin, getAuthUser };
