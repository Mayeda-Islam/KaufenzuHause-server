const { ObjectId } = require("mongodb");

const getAllOrders =
    (orderCollection) => async (req, res) => {
        try {
            await orderCollection
                .find()
                .toArray()
                .then((data) => {
                    res.json({
                        status: "success",
                        data: data,
                    });
                })
                .catch((error) => {
                    console.error("Error in Orders", error);
                });
        } catch (error) {
            console.error("Error in Orders", error);
        }
    };


const getOrdersById = (orderCollection) => async (req, res) => {
    const id = req.params.id;

    try {
        const filter = { _id: new ObjectId(id) };
        const data = await orderCollection.findOne(filter);
        res.send({
            status: "success",
            data: data,
        });
    }
    catch {
        res.send({
            status: "fail",
            message: 'Can not get any Product',
        });
    }

}
const getOrdersByStatus = (orderCollection) => async (req, res) => {
    const status = req.params.status;

    try {
        const filter = { status: status };
        const data = await orderCollection.find(filter).toArray();
        res.send({
            status: "success",
            data: data,
        });
    }
    catch {
        res.send({
            status: "fail",
            message: 'Can not get any Product',
        });
    }

}
const createOrder =
    (orderCollection, productsCollection) => async (req, res) => {
        const payment = req.body;

        try {
            // Update product quantities
            const cartItems = payment?.cart;
            for (const item of cartItems) {
                const productId = item._id;
                const productTitle = item.productTitle;
                const quantity = item.quantity;

                const product = await productsCollection.findOne({
                    _id: new ObjectId(productId),
                });

                const totalProduct = parseInt(product.totalProduct, 10);

                if (totalProduct < quantity) {
                    return res.send({
                        status: "fail",
                        message: `Insufficient quantity of ${productTitle}, you can purchase ${totalProduct}`,
                    });
                }

                await productsCollection.updateOne(
                    { _id: new ObjectId(productId) },
                    { $set: { totalProduct: totalProduct - quantity } }
                );
            }

            const result = await orderCollection.insertOne(payment);
            res.send({
                status: "success",
                data: result,
            });
        } catch (error) {
            res.send({
                status: "fail",
                message: "Your payment was not successfully processed",
            });
        }
    };


const updateOrderById = (orderCollection) => async (req, res) => {
    const id = req.params.id;

    try {
        const updatedData = req.body;
        const filter = { _id: new ObjectId(id) };

        await orderCollection.updateOne(filter, {
            $set: updatedData,
        });

        const data = await orderCollection.find({}).toArray();
        res.send({
            status: "success",
            message: "Data updated successfully!",
            data: data,
        });
    }
    catch {
        res.send({
            status: "fail",
            message: "Data did not updated",
        });
    }
}

module.exports = createOrder;

module.exports = {
    getAllOrders,
    createOrder,
    getOrdersById,
    updateOrderById,
    getOrdersByStatus
};
