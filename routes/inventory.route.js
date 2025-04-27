const express = require("express");
const Inventory = require("../config/Inventory.config");
const { 
    getInvByID, 
    addInv, 
    getInvByUsername,
    updateInv,
    removeInv
} = require("../controllers/inventory.controller");
const router = express.Router();

router.get("/:id", getInvByID); // Ensure user is registered

router.post("/add/:username", addInv); // Ensure user is registered

router.get("/user/:username", getInvByUsername);

router.put("/update/:id/:username", updateInv);


module.exports = router;
