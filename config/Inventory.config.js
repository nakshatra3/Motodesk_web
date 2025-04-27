const mongoose = require("mongoose");
require('dotenv').config();


const connect = mongoose.connect(process.env.MONGO_STRING)

connect.then(() => {
    console.log("Database Connected");
})
.catch(() => {
    console.log("Database Not Connected");
})

const InventorySchema = new mongoose.Schema({
  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
    enum: ['top', 'mid', 'base'],
  },
  costPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Inventory = new mongoose.model("inventory",InventorySchema);
module.exports = Inventory;