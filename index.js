const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
const categoriesRoutes = require("./routes/categoriesRoutes");
const aboutUsRoutes = require("./routes/aboutUsRoutes");
const imageUploaderRoutes = require("./routes/imageUploaderRoutes");
const productsRoute = require("./routes/productsRoute");
const heroSliderRoute = require("./routes/heroSliderRoute");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("image"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bgqrgmy.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // set up database collection
    const db = client.db("kaufenzuhause");
    const categoryCollection = db.collection("categories");
    const heroSliderCollection = db.collection("heroSlider");
    const productsCollection = db.collection("products");
    const aboutUsCollection = db.collection("aboutUs");

    // set up routes
    app.use(imageUploaderRoutes);
    app.use(categoriesRoutes(categoryCollection));
    app.use(productsRoute(productsCollection));
    app.use(aboutUsRoutes(aboutUsCollection));
    app.use(heroSliderRoute(heroSliderCollection));
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("KaifenzuHause API Running!");
});

app.listen(port, () => {
  console.log("KaifenzuHause Server running on Port : ", port);
});
