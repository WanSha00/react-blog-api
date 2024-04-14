const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("db connected..."))
  .catch((err) => console.log("db error: " + err));

app.use("/", (req, res) => {
  console.log("home...");
});

app.listen("5000", () => {
  console.log("Server is running...");
});
