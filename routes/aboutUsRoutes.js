module.exports = (aboutUsCollection) => {
    const express = require('express');
    const router = express.Router();
    const aboutUsController = require('../controllers/aboutUsController')
    //const { getAboutUs } = require('../controllers/aboutUsController');


    router.get('/aboutUs', aboutUsController.getAboutUs(aboutUsCollection))
    router.post('/aboutUs', aboutUsController.createAboutUs(aboutUsCollection))

    return router
}