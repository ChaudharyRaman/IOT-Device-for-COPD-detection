const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  hasCOPD: {
    type: Boolean,
    default: false,
  },
  copdHistory:[
    {
      gasConcentration: {
        type: Number,
      },
      gasType: {
        type: String,
      },
      nh3Concentration:{
        type: Number,
      },
      date: {
        type: Date,
      }
    }
  ]
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
