const { ObjectId } = require("mongodb");

const getAllProducts = (productsCollection) => (req, res) => {
  productsCollection
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

const createProduct = (productsCollection) => (req, res) => {
  const productData = req.body;

  productsCollection.insertOne(productData);
  const allData = productsCollection.find().toArray()
  res.send({
    status: "success",
    data: allData,
  });

};

const getProductsByParams = (productsCollection) => async (req, res) => {
  const { categoryTitle } = req.params;
  const filter = { category: categoryTitle };

  const data = await productsCollection.find(filter).toArray();
  res.send({
    status: "success",
    data: data,
  });
};


const getProductsById = (productsCollection) => async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const data = await productsCollection.findOne(filter);
  res.send({
    status: "success",
    data: data,
  });
};




const deleteProduct = (productsCollection) => async (req, res) => {
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
  createProduct,
  getAllProducts,
  deleteProduct,
  getProductsByParams,
  getProductsById,
};
