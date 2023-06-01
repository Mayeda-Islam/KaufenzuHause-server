const { ObjectId } = require("mongodb");

const getAllBannerSlider = (bannerSliderCollection) => (req, res) => {
  bannerSliderCollection
    .find()
    .toArray()

    .then((data) => {
      res.json({
        status: "success",
        data: data,
      });
    })
    .catch((error) => {
      console.error("Error in Category", error);
    });
};

const createBannerSlider = (bannerSliderCollection) => (req, res) => {
  const productData = req.body;

  bannerSliderCollection.insertOne(productData);
  const allData = bannerSliderCollection
    .find()
    .toArray()
    .then((result) => {
      res.json({
        status: "success",
        message: "banner image added successfully",
        //   data: allData,
      });
    })
    .catch((error) => {
      console.error("category Error:", error);
    });
};

const deleteBannerSlider = (bannerSliderCollection) => async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await bannerSliderCollection.deleteOne(filter);
  const data = await bannerSliderCollection.find({}).toArray();
  res.send({
    status: "success",
    data: data,
  });
};
module.exports = {
  getAllBannerSlider,
  createBannerSlider,
  deleteBannerSlider,
};
