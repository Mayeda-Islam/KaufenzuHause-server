module.exports = (orderCollection) => {
    const express = require("express");
    const router = express.Router();
    const orderController = require("../controllers/orderController");

    router.get(
        "/orders",
        orderController.getAllOrders(orderCollection)
    );
    router.post(
        "/order",
        orderController.createOrder(orderCollection)
    );


    return router;
};