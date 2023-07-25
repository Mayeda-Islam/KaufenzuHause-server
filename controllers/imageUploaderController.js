const singleImage = async (req, res) => {
  try {
    res.json({
      status: "success",
      url: `${process.env.IMG_HOST_NAME}/${req.file.filename}`,
    });
  } catch (err) {}
};

const multiImageUploads = async (req, res) => {
  try {
    const imageUrl = [];
    req.files.forEach((img) => {
      imageUrl.push(`${process.env.IMG_HOST_NAME}/${img.filename}`);
    });
    res.status(200).json({
      status: "success",
      imageURLs: imageUrl,
    });
  } catch (err) {}
};

const bannerSliderImage = async (req, res) => {
  try {
    console.log(req.file);
    res.json({
      status: "success",
      url: `${process.env.IMG_HOST_NAME}/${req.file.filename}`,
    });
  } catch (err) {}
};

module.exports = {
  singleImage,
  multiImageUploads,
  bannerSliderImage,
};
