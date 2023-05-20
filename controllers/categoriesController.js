const getAllCategories = (categoryCollection) => (req, res) => {
    categoryCollection.find().toArray()

        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error in Category', error);
        });
};

const createCategory = (categoryCollection) => (req, res) => {
    const systemData = req.body;

    categoryCollection.insertOne(systemData)

        .then(result => {
            res.json({ message: 'category Added successfully', systemData });
        })
        .catch(error => {
            console.error('category Error:', error);

        });
};


module.exports = {
    getAllCategories,
    createCategory
};
