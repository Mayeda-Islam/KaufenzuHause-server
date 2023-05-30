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

const createCategory = (categoryCollection) => (req, res) => {
  const categoryData = req.body;

  categoryCollection.insertOne(categoryData);
  const allData = categoryCollection
    .find()
    .toArray()
    .then((result) => {
      res.json({
        message: "category Added successfully",
        data: allData,
      });
    })
    .catch((error) => {
      console.error("category Error:", error);
    });
};

module.exports = {
  getAllCategories,
  createCategory,
};
