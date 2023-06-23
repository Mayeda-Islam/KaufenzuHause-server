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
<<<<<<< HEAD
=======
  router.patch(
    "/product/review",
    productsController.addReview(productsCollection)
  );

  router.delete(
    "/products/:productId/reviews/:reviewIndex",
    productsController.deleteReview(productsCollection)
  );
>>>>>>> 92922ba1208fe1f5aa4f3ac931b6ddce49d1c263

  return router;
};
