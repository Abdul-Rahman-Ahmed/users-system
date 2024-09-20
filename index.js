require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Router = require("./routes/users.route");
const requestStatus = require("./utils/requestStatus");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/users", Router);

// Handle wrong routes
app.use("*", (req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  return res.status(err.codeStatus || 500).json({
    status: err.errorStatus || requestStatus.ERROR,
    code: err.codeStatus || 500,
    message: err.message || "An unexpected error occurred",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
