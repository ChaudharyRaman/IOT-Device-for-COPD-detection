const { Schema, default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');
const adminSchema = new Schema({
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters long'], // Enforcing minimal length
    },
    name: {
      type: String,
      required: true,
      trim: true, // Removes leading and trailing whitespace
    },
    company: {
      type: String,
      required: true,
    },
  });
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

adminSchema.pre('save', async function (next) {
    if (!this.isModified) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const adminModel = mongoose.model("Admin", adminSchema);
module.exports = adminModel;
