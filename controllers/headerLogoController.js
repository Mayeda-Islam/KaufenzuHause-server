const { ObjectId } = require("mongodb");

const getAllHeaderLogos = (logoCollection) => async (req, res) => {
  const data = await logoCollection.find({}).toArray();
  res.send({
    status: "success",
    message: "data updated",
    data: data,
  });
};

const createHeaderLogo = (logoCollection) => async (req, res) => {
  const headerLogoData = req.body;
  logoCollection.insertOne(headerLogoData);
  const data = await logoCollection.find({}).toArray();
  res.send({
    status: "success",
    data: data,
  });
};

const updateHeaderLogo = (logoCollection) => async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const filter = { _id: new ObjectId(id) };
  const result = await logoCollection.updateOne(filter, {
    $set: updatedData,
  });
  const data = await logoCollection.find({}).toArray();
  res.send({
    status: "success",
    message: "data updated",
    data: data,
  });
};

const deleteHeaderLogo = (logoCollection) => async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const result = await logoCollection.deleteOne(filter);
  const data = await logoCollection.find({}).toArray();
  res.send({
    status: "success",
    data: data,
  });
};
module.exports = {
  createHeaderLogo,
  getAllHeaderLogos,
  updateHeaderLogo,
  deleteHeaderLogo,
};
