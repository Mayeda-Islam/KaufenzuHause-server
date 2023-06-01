module.exports = (headerLogoCollection) => {
  const express = require("express");
  const router = express.Router();
  const headerLogoController = require("../controllers/headerLogoController");

  router.get(
    "/header-logo",
    headerLogoController.getAllHeaderLogos(headerLogoCollection)
  );
  router.post(
    "/header-logo",
    headerLogoController.createHeaderLogo(headerLogoCollection)
  );
  router.delete(
    "/header-logo/:id",
    headerLogoController.deleteHeaderLogo(headerLogoCollection)
  );

  return router;
};
