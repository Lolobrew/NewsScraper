var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");


var PORT = process.env.PORT || 8080;

mongoose.Promise = Promise;

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.locals.assets = "/public/assets";
app.use("/public", express.static("public"));


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/all-routes.js")(app);


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

  // Listen on port
app.listen(PORT, function() {
    console.log("App running on port: " + PORT);
  })