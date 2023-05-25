const getAboutUs = (aboutUsCollection) => (req, res) => {

    aboutUsCollection.find().toArray()
        .then(data => {
            res.json({
                status: "success",
                dataCount: data.length,
                data: data,
            });
        })
        .catch(error => {
            res.json({
                status: "fail",
                message: "can't get the data",
            })
        })
}

const createAboutUs = (aboutUsCollection) => (req, res) => {

    const data = req.body;
    aboutUsCollection.insertOne(data)
        .then(data => {
            res.json({
                status: 'success',
                message: 'Data inserted Successfully',

                data: result
            })



        })
        .catch(error => {
            res.json({
                status: "fail",
                message: "can't get the data",
            })
        })
}

module.exports = {
    getAboutUs,
    createAboutUs
};