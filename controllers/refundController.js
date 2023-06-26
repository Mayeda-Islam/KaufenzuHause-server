const { ObjectId } = require("mongodb");

const getRefund = (refundCollection) => (req, res) => {
    refundCollection
        .find()
        .toArray()

        .then((data) => {
            res.json({
                status: "success",
                data: data,
            });
        })
        .catch((error) => {
            console.error("Error in Refund Policy", error);
        });
};

const createRefund = (refundCollection) => (req, res) => {
    const infoData = req.body;

    refundCollection.insertOne(infoData);
    const allData = refundCollection
        .find()
        .toArray()
        .then((result) => {
            res.json({
                status: "success",
                message: "Refund Policy Added successfully",
                //   data: allData,
            });
        })
        .catch((error) => {
            console.error("Refund Policy Error:", error);
        });
};

const updateRefund = (refundCollection) => async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const filter = { _id: new ObjectId(id) };
    const result = await refundCollection.updateOne(filter, {
        $set: updatedData,
    });
    const data = await refundCollection.find({}).toArray();
    res.send({
        status: "success",
        message: "data updated",
        data: data,
    });
};
module.exports = {
    getRefund,
    createRefund,
    updateRefund,
};
