const singleImage = async (req, res) => {
    try {
        res.json({
            status: "success",
            url: `https://server.kaufenzuhause.de/${req.file.filename}`,
        });
    } catch (err) { }
};

const multiImageUploads = async (req, res) => {
    try {
        const imageUrl = [];
        req.files.forEach((img) => {
            imageUrl.push(`https://server.kaufenzuhause.de/${img.filename}`);
        });
        res.status(200).json({
            status: "success",
            imageURLs: imageUrl,
        });
    } catch (err) { }
};


const bannerSliderImage = async (req, res) => {

    try {
        console.log(req.file)
        res.json({
            status: "success",
            url: `https://server.kaufenzuhause.de/${req.file.filename}`,
        });
    } catch (err) { }
}



module.exports = {
    singleImage,
    multiImageUploads,
    bannerSliderImage
};