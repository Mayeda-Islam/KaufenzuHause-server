const express = require("express");
const router = express.Router();
const imageUploaderController = require("../controllers/imageUploaderController");
const fileUploader = require("../middlewear/fileUploader");

router.post(
  "/singleImageUpload",
  fileUploader.single("image"),
  imageUploaderController.singleImage
);

router.post(
  "/multipleImageUpload",
  fileUploader.array("image"),
  imageUploaderController.multiImageUploads
);

module.exports = router;
