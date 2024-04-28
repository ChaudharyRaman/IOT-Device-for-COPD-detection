const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    console.log
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("[Database connected!]");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
module.exports = connectDB;
