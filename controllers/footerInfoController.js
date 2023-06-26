const { ObjectId } = require("mongodb");

const getFooterInfo = (footerInfoCollection) => (req, res) => {
  footerInfoCollection
    .find()
    .toArray()

    .then((data) => {
      res.json({
        status: "success",
        data: data,
      });
    })
    .catch((error) => {
      console.error("Error in Footer info", error);
    });
};

const createFooterInfo = (footerInfoCollection) => (req, res) => {
  const infoData = req.body;

  footerInfoCollection.insertOne(infoData);
  const allData = footerInfoCollection
    .find()
    .toArray()
    .then((result) => {
      res.json({
        status: "success",
        message: "Footer info Added successfully",
        //   data: allData,
      });
    })
    .catch((error) => {
      console.error("Footer info Error:", error);
    });
};

const updateFooterInfo = (footerInfoCollection) => async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const filter = { _id: new ObjectId(id) };
  const result = await footerInfoCollection.updateOne(filter, {
    $set: updatedData,
  });
  const data = await footerInfoCollection.find({}).toArray();
  res.send({
    status: "success",
    message: "data updated",
    data: data,
  });
};
module.exports = {
  getFooterInfo,
  createFooterInfo,
  updateFooterInfo,
};
