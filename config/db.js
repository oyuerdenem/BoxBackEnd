require('dotenv').config();
const { log } = require("console");
const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // Removed deprecated options
    console.log("DB connected.");
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
}

connectToDatabase();