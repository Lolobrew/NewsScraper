var path = require ("path");
var request = require("request");
var cheerio = require("cheerio");
var Article = require("../models/Article.js");

module.exports = function(app) {

    app.get("/", function(req, res){
        res.render("index",
            {
                layout: "main",
                css: "index.css"
            }
        );
    });


    app.get("/scrape", function(req, res){
        request("http://www.theonion.com/section/local/", function(error, response, html) {
            var $ = cheerio.load(html);

            $("div .info").each(function(i, element) {
                var result = {};
                result.title = $(this).children("h2 .headline").text();
                result.summary = $(this).children("div .desc").text();
                result.link = $(this).children("img").attr("src");

                var entry = new Article(result);
                entry.save(function(err, doc) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(doc);
                    }
                });
            });
        });
        res.send("Scrape Complete");
    });

    
};



/*  // This will get the articles we scraped from the mongoDB
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
  });*/
  
