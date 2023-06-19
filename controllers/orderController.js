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

module.exports = createOrder;

module.exports = {
    getAllOrders,
    createOrder,
};
