const express = require("express");
const { getPrice, addOrUpdatePrice } = require("../controllers/price.controllers");
const router = express.Router();

router.get("/",getPrice);
router.post("/add",addOrUpdatePrice);

module.exports = router;