module.exports = (footerInfoCollection) => {
  const express = require("express");
  const router = express.Router();
  const footerInfoController = require("../controllers/footerInfoController");

  router.get(
    "/footer-Info",
    footerInfoController.getFooterInfo(footerInfoCollection)
  );
  router.post(
    "/footer-Info",
    footerInfoController.createFooterInfo(footerInfoCollection)
  );
  router.patch(
    "/footer-Info/:id",
    footerInfoController.updateFooterInfo(footerInfoCollection)
  );

  return router;
};
