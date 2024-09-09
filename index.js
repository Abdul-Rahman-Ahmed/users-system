require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());

const connect = async () => {
  await mongoose.connect(process.env.MONGO_DB);
  console.log("connect to DB");
};
connect().catch((err) => console.log(err));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port :" + process.env.PORT || 3000);
});
