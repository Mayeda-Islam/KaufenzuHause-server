const { ObjectId } = require("mongodb");

const getAllCategories = (categoryCollection) => (req, res) => {
  categoryCollection
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

const createCategory = (categoryCollection) => async (req, res) => {
  const categoryData = req.body;
  const result = await categoryCollection.insertOne(categoryData);
  const allData = await categoryCollection.find({}).toArray();

  res.send({
    status: "success",
    data: allData,
  });
};
const deleteCategory = (categoryCollection) => async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await categoryCollection.deleteOne(filter);
  const data = await categoryCollection.find({}).toArray();
  res.send({
    status: "success",
    data: data,
  });
};

module.exports = {
  getAllCategories,
  createCategory,
  deleteCategory,
};
