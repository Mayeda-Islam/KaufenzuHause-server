const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const categoriesRoutes = require('./routes/categoriesRoutes');
const aboutUsRoutes = require('./routes/aboutUsRoutes');


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bgqrgmy.mongodb.net/?retryWrites=true&w=majority`


const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

async function run() {
    try {

        // set up database collection 
        const db = client.db('kaufenzuhause')
        const categoryCollection = db.collection('categories')
        const aboutUsCollection = db.collection('aboutUs')


        // set up routes 
        app.use(categoriesRoutes(categoryCollection))
        app.use(aboutUsRoutes(aboutUsCollection))
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('KaifenzuHause API Running!')
})

app.listen(port, () => {
    console.log('KaifenzuHause Server running on Port : ', port)
})
