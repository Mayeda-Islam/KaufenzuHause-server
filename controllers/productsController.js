const createProduct = (productsCollection) => (req, res) => {
  const productData = req.body;

  productsCollection.insertOne(productData);
  const allData = productsCollection
    .find()
    .toArray()
    .then((result) => {
      res.json({
        message: "Product Added successfully",
        //   data: allData,
      });
    })
    .catch((error) => {
      console.error("category Error:", error);
    });
};
module.exports = { createProduct };
