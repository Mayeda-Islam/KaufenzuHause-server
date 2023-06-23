module.exports = (productsCollection) => {
  const express = require("express");
  const router = express.Router();
  const productsController = require("../controllers/productsController");

  router.get(
    "/products",
    productsController.getAllProducts(productsCollection)
  );

  router.get(
    "/product/:categoryTitle",
    productsController.getProductsByParams(productsCollection)
  );

  router.get(
    "/products/:id",
    productsController.getProductsById(productsCollection)
  );

  router.post("/product", productsController.createProduct(productsCollection));
  router.patch(
    "/product/:id",
    productsController.updateProduct(productsCollection)
  );

  router.delete(
    "/product/:id",
    productsController.deleteProduct(productsCollection)
  );

  return router;
};
