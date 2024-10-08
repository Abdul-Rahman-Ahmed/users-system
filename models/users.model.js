const mongoose = require("mongoose");
const Roles = require("../utils/roles");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: Roles.USER,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  confirmToken: String,
  confirmTokenExpires: Date,
  activities: [
    {
      activity: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
