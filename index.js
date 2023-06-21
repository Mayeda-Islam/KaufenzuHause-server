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
const bannerSliderRoute = require("./routes/bannerSliderRoute");
const logoRoutes = require("./routes/logoRoutes");
const footerDescriptionRoutes = require("./routes/footerDescriptionRoutes");
const footerInfoRoutes = require("./routes/footerInfoRoutes");
const categorySliderRoutes = require("./routes/categorySliderRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`);

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("image"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bgqrgmy.mongodb.net/?retryWrites=true&w=majority`;
const uri2 = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri2, {
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
    const bannerSliderCollection = db.collection("bannerSlider");
    const productsCollection = db.collection("products");
    const aboutUsCollection = db.collection("aboutUs");
    const logoCollection = db.collection("logo");
    const footerDescriptionCollection = db.collection("footerDescription");
    const footerInfoCollection = db.collection("footerInfo");
    const categorySliderCollection = db.collection("categorySlider");
    const orderCollection = db.collection("orders");
    const userCollection = db.collection("users");
    const otpCollection = db.collection("otp");
    const forgetOTPCollection = db.collection("forgetOTP");

    // set up routes
    app.use(imageUploaderRoutes);
    app.use(categoriesRoutes(categoryCollection));
    app.use(productsRoute(productsCollection));
    app.use(aboutUsRoutes(aboutUsCollection));
    app.use(heroSliderRoute(heroSliderCollection));
    app.use(bannerSliderRoute(bannerSliderCollection));
    app.use(logoRoutes(logoCollection));
    app.use(footerDescriptionRoutes(footerDescriptionCollection));
    app.use(footerInfoRoutes(footerInfoCollection));
    app.use(categorySliderRoutes(categorySliderCollection));
    app.use(orderRoutes(orderCollection, productsCollection));
    app.use(userRoutes(userCollection, otpCollection, forgetOTPCollection));

    app.post("/payment", async (req, res) => {
      const { price } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "eur",
        amount: price,
        payment_method_types: ["card"],
      });
      res.send({
        status: "success",
        clientSecret: paymentIntent.client_secret,
      });
    });
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

module.exports = app;
