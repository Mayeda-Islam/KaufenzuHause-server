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
    "/productPatch/:id",
    productsController.updateProduct(productsCollection)
  );

  router.delete(
    "/product/:id",
    productsController.deleteProduct(productsCollection)
  );
  router.patch(
    "/product/review",
    productsController.addReview(productsCollection)
  );

  router.delete(
    "/products/:productId/reviews/:reviewIndex",
    productsController.deleteReview(productsCollection)
  );

  return router;
};
