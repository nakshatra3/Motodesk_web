const mongoose = require("mongoose");
require('dotenv').config();

const connect = mongoose.connect(process.env.MONGO_STRING);

connect.then(() => {
    console.log("Database Connected");
})
.catch(() => {
    console.log("Database Not Connected");
});

// Updated CustomerSchema with rating and description fields
const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    car: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
    status: { type: String, required: true },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, // Minimum rating
        max: 5  // Maximum rating
    },
    description: { 
        type: String, 
        required: false, // Optional field
        trim: true // Trim whitespace from the description
    }
});

const Customers = new mongoose.model("Customers", CustomerSchema);
module.exports = Customers;
