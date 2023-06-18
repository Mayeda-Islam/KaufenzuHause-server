const getAllOrders = (orderCollection) => async (req, res) => {
    try {
        await orderCollection.find().toArray()
            .then((data) => {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((error) => {
                console.error("Error in Orders", error);
            });
    }
    catch (error) {
        console.error("Error in Orders", error);
    }
}

const createOrder = (orderCollection) => async (req, res) => {

    const payment = req.body;

    const result = await orderCollection.insertOne(payment)
    res.send({
        status: 'success',
        data: result
    })
}

module.exports = {
    getAllOrders,
    createOrder
};