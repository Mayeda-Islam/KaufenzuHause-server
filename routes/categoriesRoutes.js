module.exports = (categoryCollection) => {
  const categoriesController = require("../controllers/categoriesController");
  const express = require("express");
  const router = express.Router();

  router.get(
    "/categories",
    categoriesController.getAllCategories(categoryCollection)
  );
  router.post(
    "/category",
    categoriesController.createCategory(categoryCollection)
  );
  router.delete(
    "/category/:categoryId",
    categoriesController.deleteCategory(categoryCollection)
  );
  return router;
};
