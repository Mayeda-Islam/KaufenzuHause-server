const singleImage = async (req, res) => {
    try {
        res.json({
            status: "success",
            url: `http://localhost:5000/${req.file.filename}`,
        });
    } catch (err) { }
};

const multiImageUploads = async (req, res) => {
    try {
        const imageUrl = [];
        req.files.forEach((img) => {
            imageUrl.push(`${process.env.multer_url}/${img.filename}`);
        });
        res.status(200).json({
            status: "success",
            imageURLs: imageUrl,
        });
    } catch (err) { }
};

module.exports = {
    singleImage,
    multiImageUploads
};