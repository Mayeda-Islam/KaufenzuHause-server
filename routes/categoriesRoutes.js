module.exports = (categoryCollection) => {
  const express = require("express");
  const router = express.Router();
  const categoriesController = require("../controllers/categoriesController");

  router.get(
    "/categories",
    categoriesController.getAllCategories(categoryCollection)
  );
  router.post(
    "/category",
    categoriesController.createCategory(categoryCollection)
  );

  return router;
};
