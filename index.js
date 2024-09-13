require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Router = require("./routes/users.route");
const requestStatus = require("./utils/requestStatus");

const app = express();
app.use(express.json());
app.use(cors());

const connect = async () => {
  await mongoose.connect(process.env.MONGO_DB);
  console.log("connect to DB");
};
connect().catch((err) => console.log(err));

app.use("/api/users", Router);

app.use("*", (req, res) => {
  return res.status(400).json({ message: "wrong request" });
});
app.use((err, req, res, next) => {
  return res.status(err.status || 400).json({
    status: err.errorStatus || requestStatus.ERROR,
    code: err.codeStatus || 400,
    message: err.message || "something is Wrong",
    data: null,
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
