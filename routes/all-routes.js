var path = require ("path");
var request = require("request");
var cheerio = require("cheerio");
var Article = require("../models/Article.js");
var Thought = require("../models/Thought.js");

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
        request("http://www.technewsworld.com/", function(error, response, html) {
            var $ = cheerio.load(html);

            $("div .story-list").each(function(i, element) {
                var result = {};

                //title w/ error handling
                if ($(this).children(".title").children("a").text() == ""){
                  result.title = "undefined";
                } else {
                  result.title = $(this).children(".title").children("a").text();
                }
                //summary w/ error handling
                if ($(this).children(".teaser").text() == ""){
                  result.summary = "undefined";
                } else {
                  result.summary = $(this).children(".teaser").text();
                }
                //image (link) w/ error handling
                if ($(this).children(".image").children("a").children("img").attr("src") == ""){
                  result.link = "undefined"
                } else {
                  result.link = $(this).children(".image").children("a").children("img").attr("src");
                }
                
              console.log(result);
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
    

    app.get("/delete", function(req, res){

      Article.remove().exec(function(err, data){
        if (err){
          console.log(err);
        } else {
          res.send("Data Cleared");
        }
      });

    });
};




  
