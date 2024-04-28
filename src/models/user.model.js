const { Schema } = require("mongoose");

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
    required: true,
  },
  copdData: {
    type: Array,
    required: false,
  },
});
