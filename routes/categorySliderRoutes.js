module.exports = (categorySliderCollection) => {
  const express = require("express");
  const router = express.Router();
  const categorySliderController = require("../controllers/categorySliderController");

  router.get(
    "/category-slider",
    categorySliderController.getAllCategorySlider(categorySliderCollection)
  );
  router.post(
    "/category-slider",
    categorySliderController.createCategorySlider(categorySliderCollection)
  );
  router.patch(
    "/category-slider/:id",
    categorySliderController.updateCategorySlider(categorySliderCollection)
  );
  router.delete(
    "/category-slider/:id",
    categorySliderController.deleteCategorySlider(categorySliderCollection)
  );

  return router;
};
