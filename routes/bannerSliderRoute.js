module.exports = (bannerSliderCollection) => {
  const express = require("express");
  const router = express.Router();
  const bannerSliderController = require("../controllers/bannerSliderController");

  router.get(
    "/banner-slider",
    bannerSliderController.getAllBannerSlider(bannerSliderCollection)
  );
  router.post(
    "/banner-slider",
    bannerSliderController.createBannerSlider(bannerSliderCollection)
  );
  router.delete(
    "/banner-slider/:id",
    bannerSliderController.deleteBannerSlider(bannerSliderCollection)
  );

  return router;
};
