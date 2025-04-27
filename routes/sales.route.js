const express = require("express");
const { show, makeSale, genReports, displaySales, getSalesByUsername } = require("../controllers/sales.controllers");
const router = express.Router();

router.get("/",show);
router.post("/add/:username",makeSale);
router.get("/report/:username",genReports);
router.get("/getSales",displaySales);

// router.post("/addNewSale", checkUserRegistered, addnewSale);
router.get("/user/:username", getSalesByUsername);

module.exports = router;