const { ObjectId } = require("mongodb");

const getFooterDescription = (footerDescriptionCollection) => (req, res) => {
  footerDescriptionCollection
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

const createFooterDescription = (footerDescriptionCollection) => (req, res) => {
  const headerLogoData = req.body;

  footerDescriptionCollection.insertOne(headerLogoData);
  const allData = footerDescriptionCollection
    .find()
    .toArray()
    .then((result) => {
      res.json({
        status: "success",
        message: "Description Added successfully",
        //   data: allData,
      });
    })
    .catch((error) => {
      console.error("category Error:", error);
    });
};

const updateFooterDescription =
  (footerDescriptionCollection) => async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const result = await footerDescriptionCollection.deleteOne(filter);
    const data = await footerDescriptionCollection.find({}).toArray();
    res.send({
      status: "success",
      data: data,
    });
  };
module.exports = {
  getFooterDescription,
  createFooterDescription,
  updateFooterDescription,
};
