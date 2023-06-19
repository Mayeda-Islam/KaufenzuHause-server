module.exports = (orderCollection, productsCollection) => {
  const express = require("express");
  const router = express.Router();
  const orderController = require("../controllers/orderController");

  router.get(
    "/orders",
    orderController.getAllOrders(orderCollection, productsCollection)
  );
  router.post(
    "/order",
    orderController.createOrder(orderCollection, productsCollection)
  );

  return router;
};
