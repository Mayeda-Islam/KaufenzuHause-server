const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    // change it when upload to c-panel
    // destination: "image/",
    destination: "image/",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const fileUploader = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const supportedImage = (/\.(jpg|jpeg|png)$/);
        const extension = path.extname(file.originalname);
        if (supportedImage.test(extension)) {
            cb(null, true);
        } else {
            cb(new Error("Must be a png/jpg/jpeg image"));
        }
    },
    limits: {
        fileSize: 5000000,
    },
});

module.exports = fileUploader;
