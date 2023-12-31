module.exports = (categoryCollection) => {
  const categoriesController = require("../controllers/categoriesController");
  const express = require("express");
  const router = express.Router();

  router.get(
    "/categories",
    categoriesController.getAllCategories(categoryCollection)
  );
  router.get(
    "/categories/:id",
    categoriesController.getCategoryById(categoryCollection)
  );
 
  router.post(
    "/category",
    categoriesController.createCategory(categoryCollection)
  );
  router.delete(
    "/category/:id",
    categoriesController.deleteCategory(categoryCollection)
  );

  return router;
};
