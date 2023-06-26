module.exports = (socialMediaCollection) => {
    const express = require("express");
    const router = express.Router();
    const socialMediaController = require("../controllers/socialMediaController");

    router.get(
        "/socialMedia",
        socialMediaController.getSocialMedia(socialMediaCollection)
    );
    router.post(
        "/socialMedia",
        socialMediaController.createSocialMedia(socialMediaCollection)
    );
    router.patch(
        "/socialMedia/:id",
        socialMediaController.updateSocialMedia(socialMediaCollection)
    );

    return router;
};
