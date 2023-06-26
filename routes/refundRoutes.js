module.exports = (refundCollection) => {
    const express = require("express");
    const router = express.Router();
    const refundController = require("../controllers/refundController");

    router.get(
        "/refund",
        refundController.getRefund(refundCollection)
    );
    router.post(
        "/refund",
        refundController.createRefund(refundCollection)
    );
    router.patch(
        "/refund/:id",
        refundController.updateRefund(refundCollection)
    );


    return router;
};
