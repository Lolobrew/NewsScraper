$('#scrapeBtn').on("click", function(){
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data) {
    //display articles after a timeout so it has time to retrieve info and post to articles api route
    function showArticles() {
      setTimeout(function(){
        $.getJSON("/articles", function(data) {
          // For each one
          for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            $("#articles").append("<h2 data-id='" + data[i]._id + "'>" + data[i].title + "</h2><br/><h4>" + data[i].summary + "</h4><br/><img src='http://www.technewsworld.com/" + data[i].link + "'/><br>");
          }
              //empty btn div, dynamically create a clear button for deleting data
              $('#btnDiv').empty();
              $('#btnDiv').append("<btn class='btn btn-warning' id='clearIt'>Clear It</btn>");
              $('#clearIt').on("click", function(){
                $('#thoughts').empty();
                $('#articles').empty();
                $.ajax({
                  method: "GET",
                  url: "/delete"
                }).done(function(data){
                  window.location.replace("http://localhost:8080");
                })
              });
        });
      }, 2000);
    }

    showArticles();

  });
});



// Whenever someone clicks a p tag
$(document).on("click", "h2", function() {
  // Empty the thoughts from the thought section
  $("#thoughts").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the thought information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#thoughts").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#thoughts").append("<input id='titleinput' name='title' >");
      // A textarea to add a new thought body
      $("#thoughts").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new thought, with the id of the article saved to it
      $("#thoughts").append("<button data-id='" + data._id + "' id='savethought'>Save Thought</button>");

      // If there's a thought in the article
      if (data.thought) {
        // Place the title of the thought in the title input
        $("#titleinput").val(data.thought.title);
        // Place the body of the thought in the body textarea
        $("#bodyinput").val(data.thought.body);
      }
    });
});

// When you click the savethought button
$(document).on("click", "#savethought", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the thought, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from thought textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the thoughts section
      $("#thoughts").empty();
    });

  // Also, remove the values entered in the input and textarea for thought entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});