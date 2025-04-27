const mongoose = require("mongoose");
require('dotenv').config();


const connect = mongoose.connect(process.env.MONGO_STRING)

connect.then(() => {
    console.log("Database Connected");
})
.catch(() => {
    console.log("Database Not Connected");
});

// Updated Sales Schema
const PriceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
    enum: ['top', 'mid', 'base'],
  },
  color: {
    type: String,
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Price = mongoose.model("price", PriceSchema);
module.exports = Price;
