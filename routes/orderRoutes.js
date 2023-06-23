module.exports = (orderCollection, productsCollection) => {
  const express = require("express");
  const router = express.Router();
  const orderController = require("../controllers/orderController");


  router.post(
    "/order",
    orderController.createOrder(orderCollection, productsCollection)
  );

  router.get(
    "/orders",
    orderController.getAllOrders(orderCollection, productsCollection)
  );
  router.get(
    "/orders/:id",
    orderController.getOrdersById(orderCollection)
  );
  router.get(
    "/orders/status/:status",
    orderController.getOrdersByStatus(orderCollection)
  );

  router.patch(
    "/orders/:id",
    orderController.updateOrderById(orderCollection)
  );

  return router;
};
