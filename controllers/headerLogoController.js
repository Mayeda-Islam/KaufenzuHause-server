const { ObjectId } = require("mongodb");

const getAllHeaderLogos = (headerLogoCollection) => (req, res) => {
  headerLogoCollection
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

const createHeaderLogo = (headerLogoCollection) => (req, res) => {
  const headerLogoData = req.body;

  headerLogoCollection.insertOne(headerLogoData);
  const allData = headerLogoCollection
    .find()
    .toArray()
    .then((result) => {
      res.json({
        status: "success",
        message: "HeaderLogo Added successfully",
        //   data: allData,
      });
    })
    .catch((error) => {
      console.error("category Error:", error);
    });
};

const deleteHeaderLogo = (headerLogoCollection) => async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await headerLogoCollection.deleteOne(filter);
  const data = await headerLogoCollection.find({}).toArray();
  res.send({
    status: "success",
    data: data,
  });
};
module.exports = {
  createHeaderLogo,
  getAllHeaderLogos,
  deleteHeaderLogo,
};
