const { ObjectId } = require("mongodb");

const getAllCategorySlider = (categorySliderCollection) => (req, res) => {
  categorySliderCollection
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

const createCategorySlider = (categorySliderCollection) => async (req, res) => {
  const infoData = req.body;

  await categorySliderCollection.insertOne(infoData);
  const data = await categorySliderCollection.find().toArray();

  res.send({
    status: "success",
    data: data,
  });
};

const deleteCategorySlider = (categorySliderCollection) => async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await categorySliderCollection.deleteOne(filter);
  const data = await categorySliderCollection.find({}).toArray();
  res.send({
    status: "success",
    data: data,
  });
};

const updateCategorySlider = (categorySliderCollection) => async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const filter = { _id: new ObjectId(id) };
  const result = await categorySliderCollection.updateOne(filter, {
    $set: updatedData,
  });
  const data = await categorySliderCollection.find({}).toArray();
  res.send({
    status: "success",
    message: "data updated",
    data: data,
  });
};
module.exports = {
  getAllCategorySlider,
  createCategorySlider,
  updateCategorySlider,
  deleteCategorySlider,
};
