// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Comment schema
var ThoughtSchema = new Schema({
  // Just a string
  title: {
    type: String
  },
  // Just a string
  body: {
    type: String
  }
});

// Create the Comment model with the CommentSchema
var Thought = mongoose.model("Thought", ThoughtSchema);

// Export the Comment model
module.exports = Thought;