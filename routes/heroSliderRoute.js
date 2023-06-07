module.exports = (heroSliderCollection) => {
  const express = require("express");
  const router = express.Router();
  const heroSliderController = require("../controllers/heroSliderController");

  router.get(
    "/hero-slider",
    heroSliderController.getAllHeroSlider(heroSliderCollection)
  );
  router.post(
    "/hero-slider",
    heroSliderController.createHeroSlider(heroSliderCollection)
  );
  router.delete(
    "/hero-slider/:id",
    heroSliderController.deleteHeroSlider(heroSliderCollection)
  );

  return router;
};
