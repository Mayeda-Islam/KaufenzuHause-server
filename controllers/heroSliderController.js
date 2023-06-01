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

const createHeroSlider = (productsCollection) => (req, res) => {
  const productData = req.body;

  productsCollection.insertOne(productData);
  const allData = productsCollection
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

const deleteHeroSlider = (productsCollection) => async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await productsCollection.deleteOne(filter);
  const data = await productsCollection.find({}).toArray();
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
