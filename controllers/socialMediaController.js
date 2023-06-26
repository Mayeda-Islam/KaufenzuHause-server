const { ObjectId } = require("mongodb");

const getSocialMedia = (socialMediaCollection) => (req, res) => {
    socialMediaCollection
        .find()
        .toArray()

        .then((data) => {
            res.json({
                status: "success",
                data: data,
            });
        })
        .catch((error) => {
            console.error("Error in Social Media", error);
        });
};

const createSocialMedia = (socialMediaCollection) => (req, res) => {
    const infoData = req.body;

    socialMediaCollection.insertOne(infoData);

    res.json({
        status: "success",
        message: " Social Media Added successfully",
    });

};

const updateSocialMedia = (socialMediaCollection) => async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    const filter = { _id: new ObjectId(id) };
    const result = await socialMediaCollection.updateOne(filter, {
        $set: updatedData,
    });
    const data = await socialMediaCollection.find({}).toArray();
    res.send({
        status: "success",
        message: "data updated",
        data: data,
    });
};
module.exports = {
    getSocialMedia,
    createSocialMedia,
    updateSocialMedia,
};
