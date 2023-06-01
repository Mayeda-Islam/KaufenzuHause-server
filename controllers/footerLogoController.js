const { ObjectId } = require("mongodb");

const getAllFooterLogos = (footerLogoCollection) => (req, res) => {
  footerLogoCollection
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

const createFooterLogo = (footerLogoCollection) => (req, res) => {
  const footerLogoData = req.body;

  footerLogoCollection.insertOne(footerLogoData);
  const allData = footerLogoCollection
    .find()
    .toArray()
    .then((result) => {
      res.json({
        status: "success",
        message: "footerLogo Added successfully",
        //   data: allData,
      });
    })
    .catch((error) => {
      console.error("category Error:", error);
    });
};

const deleteFooterLogo = (footerLogoCollection) => async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await footerLogoCollection.deleteOne(filter);
  const data = await footerLogoCollection.find({}).toArray();
  res.send({
    status: "success",
    data: data,
  });
};
module.exports = {
  createFooterLogo,
  getAllFooterLogos,
  deleteFooterLogo,
};
