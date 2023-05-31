module.exports = (footerLogoCollection) => {
  const express = require("express");
  const router = express.Router();
  const footerLogoController = require("../controllers/footerLogoController");

  router.get(
    "/footer-logo",
    footerLogoController.getAllFooterLogos(footerLogoCollection)
  );
  router.post(
    "/footer-logo",
    footerLogoController.createFooterLogo(footerLogoCollection)
  );
  router.delete(
    "/footer-logo/:id",
    footerLogoController.deleteFooterLogo(footerLogoCollection)
  );

  return router;
};
