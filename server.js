var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var Comment = require("./models/Thought.js");
var Article = require("./models/Article.js")

var PORT = process.env.PORT || 8080;

mongoose.Promise = Promise;

var app = express();

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/newsscraperdb", {
    useMongoClient: true
  });
  var db = mongoose.connection;
  
  // Show any mongoose errors
  db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
  });
  
  // Once logged in to the db through mongoose, log a success message
  db.once("open", function() {
    console.log("Mongoose connection successful.");
  });


  // Routes
// ======

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("http://www.echojs.com/", function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
  
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).children("a").text();
        result.summary = $(this).//insert summay result here!
        result.link = $(this).children("a").attr("href");
  
        // Using our Article model, create a new entry
        // This effectively passes the result object to the entry (and the title and link)
        var entry = new Article(result);
  
        // Now, save that entry to the db
        entry.save(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          // Or log the doc
          else {
            console.log(doc);
          }
        });
  
      });
    });
    // Tell the browser that we finished scraping the text
    res.send("Scrape Complete");
  });


  // This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
    // Grab every doc in the Articles array
    Article.find({}, function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Or send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
  });


  // Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({ "_id": req.params.id })
    // ..and populate all of the thoughts associated with it
    .populate("thought")
    // now, execute our query
    .exec(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise, send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
  });
  
  
  // Create a new Thought or replace an existing Thought
  app.post("/articles/:id", function(req, res) {
    // Create a new Thought and pass the req.body to the entry
    var newThought = new Thought(req.body);
  
    // And save the new Thought the db
    newThought.save(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise
      else {
        // Use the article id to find and update it's Thought
        Article.findOneAndUpdate({ "_id": req.params.id }, { "thought": doc._id })
        // Execute the above query
        .exec(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          else {
            // Or send the document to the browser
            res.send(doc);
          }
        });
      }
    });
  });



  // Listen on port
app.listen(PORT, function() {
    console.log("App running on port: " + PORT);
  })