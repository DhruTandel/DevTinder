const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );
  } catch (err) {
    throw new Error("Database is not connected because of : "+err.message)
  }
}; 

module.exports = connectDB;
