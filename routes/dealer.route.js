const express = require("express");
const { getDealers } = require("../controllers/dealer.controller");
const router = express.Router();

router.get("/",getDealers);

module.exports = router;

