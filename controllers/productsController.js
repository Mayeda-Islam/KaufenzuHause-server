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
  const allData = productsCollection.find().toArray();
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
const updateProduct = (productsCollection) => async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const filter = { _id: new ObjectId(id) };

  await productsCollection.updateOne(filter, {
    $set: updatedData,
  });
  const data = await productsCollection.find({}).toArray();
  res.send({
    status: "success",
    message: "data updated",
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

const addReview = (productsCollection) => async (req, res) => {
  const { productId, email, text } = req.body;

  try {
    if (!productId || !email || !text) {
      return res.send({
        status: "fail",
        message: "Invalid information",
      });
    }

    const product = await productsCollection.findOne({
      _id: new ObjectId(productId),
    });

    if (product) {
      if (!product.reviews) {
        product.reviews = [];
      }

      const review = { email, text, createdAt: Date.now() };
      product.reviews.push(review);

      await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $set: product }
      );

      res.send({
        status: "success",
        message: "Review added successfully",
        data: product,
      });
    } else {
      res.send({
        status: "fail",
        message: "Product not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: "fail",
      message: "Error adding review",
    });
  }
};

const deleteReview = (productsCollection) => async (req, res) => {
  const { productId, reviewIndex } = req.params;

  try {
    const product = await productsCollection.findOne({
      _id: new ObjectId(productId),
    });

    if (product) {
      if (reviewIndex >= 0 && reviewIndex < product.reviews.length) {
        product.reviews.splice(reviewIndex, 1);

        await productsCollection.updateOne(
          { _id: new ObjectId(productId) },
          { $set: product }
        );

        const updatedProduct = await productsCollection.findOne({
          _id: new ObjectId(productId),
        });

        res.send({
          status: "success",
          message: "Review deleted successfully",
          data: updatedProduct,
        });
      } else {
        res.send({
          status: "fail",
          message: "Review index is out of bounds",
        });
      }
    } else {
      res.send({
        status: "fail",
        message: "Product not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      status: "fail",
      message: "Error deleting review",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  deleteProduct,
  getProductsByParams,
  getProductsById,
  updateProduct,
  deleteReview,
  addReview,
};
