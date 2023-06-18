const getAllUsers = (userCollection) => async (req, res) => {
    try {

        const data = await userCollection.find({}).toArray()

        res.send({
            status: 'success',
            data: data
        })
        // userCollection
        //     .find()
        //     .toArray()

        //     .then((data) => {
        //         res.json({
        //             status: "success",
        //             data: data,
        //         });
        //     })
        //     .catch((error) => {
        //         console.error("Error in Orders", error);
        //     });
    }
    catch (error) {
        res.send({
            status: 'failed',
            message: 'Something Went Wrong With Users'
        })
    }
}

module.exports = {
    getAllUsers,
};