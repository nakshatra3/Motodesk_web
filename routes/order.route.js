const express = require("express");
const { showOrderForm, makeOrder, updateOrderStatusToConfirmed, updateOrderStatusToDelivered, displayOrder, makeOrderByUsername } = require("../controllers/order.controller");
const router = express.Router();

router.get("/",showOrderForm);
router.post("/add",makeOrder);
router.get("/getOrder",displayOrder);
router.post("/order/update/confirmed/:orderId",updateOrderStatusToConfirmed);
router.post("/order/update/delivered/:orderId",updateOrderStatusToDelivered);

router.post("/addnew/:username",makeOrderByUsername);

module.exports = router;