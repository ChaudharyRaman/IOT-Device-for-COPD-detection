const { Schema, default: mongoose } = require("mongoose");

const copdSchema = new Schema(
  {
    age: {
      type: Number,
      required: true,
    },
    hasCOPD: {
      type: Boolean,
      required: true,
    },
    copdData: {
      gasConcentration: {
        type: Number,
        required: true,
      },
      gasType: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const copdModel = mongoose.model("COPD", copdSchema);

module.exports = copdModel;
