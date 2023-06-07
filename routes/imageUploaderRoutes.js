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
  fileUploader.array("images"),
  imageUploaderController.multiImageUploads
);


// slider image upload
router.post(
  '/sliderImageUpload',
  fileUploader.single(''),
  imageUploaderController.bannerSliderImage
);

module.exports = router

