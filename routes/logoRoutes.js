module.exports = (logoCollection) => {
  const express = require("express");
  const router = express.Router();
  const headerLogoController = require("../controllers/headerLogoController");

  router.get(
    "/logo",
    headerLogoController.getAllHeaderLogos(logoCollection)
  );
  router.post(
    "/logo",
    headerLogoController.createHeaderLogo(logoCollection)
  );
  router.patch(
    "/logo/:id",
    headerLogoController.updateHeaderLogo(logoCollection)
  );
  router.delete(
    "/logo/:id",
    headerLogoController.deleteHeaderLogo(logoCollection)
  );

  return router;
};
