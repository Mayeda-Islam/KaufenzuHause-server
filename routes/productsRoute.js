module.exports = (productsCollection) => {
  const express = require("express");
  const router = express.Router();
  const productsController = require("../controllers/productsController");

  router.post("/product", productsController.createProduct(productsCollection));

  return router;
};
