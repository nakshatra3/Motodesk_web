const express = require('express');
const { addCust, getReviews } = require('../controllers/customer.controllers');
const router = express.Router();

// Add Customer
router.post("/add",addCust);

// Get Customer Details
router.get('/reviews', getReviews);

module.exports = router;