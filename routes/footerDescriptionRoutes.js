module.exports = (footerDescriptionCollection) => {
  const express = require("express");
  const router = express.Router();
  const footerDescriptionController = require("../controllers/footerDescriptionController");

  router.get(
    "/footer-description",
    footerDescriptionController.getFooterDescription(
      footerDescriptionCollection
    )
  );
  router.post(
    "/footer-description",
    footerDescriptionController.createFooterDescription(
      footerDescriptionCollection
    )
  );
  router.patch(
    "/footer-description/:id",
    footerDescriptionController.updateFooterDescription(
      footerDescriptionCollection
    )
  );

  return router;
};
