const { ObjectId } = require("mongodb");

const getAllHeroSlider = (heroSliderCollection) => (req, res) => {
  heroSliderCollection
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

const createHeroSlider = (heroSliderCollection) => (req, res) => {
  const productData = req.body;

  heroSliderCollection.insertOne(productData);
  const allData = heroSliderCollection
    .find()
    .toArray()
    .then((result) => {
      res.json({
        status: "success",
        message: "Product Added successfully",
        //   data: allData,
      });
    })
    .catch((error) => {
      console.error("category Error:", error);
    });
};

const deleteHeroSlider = (heroSliderCollection) => async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await heroSliderCollection.deleteOne(filter);
  const data = await heroSliderCollection.find({}).toArray();
  res.send({
    status: "success",
    data: data,
  });
};
module.exports = {
  getAllHeroSlider,
  createHeroSlider,
  deleteHeroSlider,
};
