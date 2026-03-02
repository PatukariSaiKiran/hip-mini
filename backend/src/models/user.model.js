const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // will be hashed
    role: { type: String, enum: ["ADMIN", "USER"], default: "USER" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
