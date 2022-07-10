const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const isProduction = process.env.NODE_ENV === "production";
const port = isProduction ? 7500 : 3000;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connecting to MongoDB through the "MongoClient's" connect method
MongoClient.connect(
  "mongodb+srv://gilesgr1:MongoDB10@cluster0.lahdbch.mongodb.net/?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
  }
)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");

    app.get("/", (req, res) => {
      //view is the name of the file we're rendering. placed inside a views folder
      //local is the data passed into the file

      db.collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { quotes: results });
        })
        .catch(/* ... */);
    });

    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    //create a server that browsers can connect to
    app.listen(port, function () {
      console.log(`listening on ${port}`);
    });
  })
  .catch(console.error);
