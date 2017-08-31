$('#scrapeBtn').on("click", function(){
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data){

    setTimeout(function getArticles(){
      window.location.replace("http://localhost:8080/articles");
    }, 2000);
    
    getArticles();

  });
});



$('#clearBtn').on('click', function(e){
  $.ajax({
    method: "GET",
    url: "/delete"
  }).done(function(data){
    window.location.replace("http://localhost:8080/");
  });
});


// Whenever someone clicks a h2 tag
$(document).on("click", "h2", function() {
  // Save the id from the h2 tag
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
      $("#thoughts").append("<h5>" + data.title + "</h5>");
      // An input to enter a new title
      $("#thoughts").append("<input id='titleinput' name='title' class='form-control' type='text' placeholder='Title your Thought'>");
      // A textarea to add a new thought body
      $("#thoughts").append("<textarea id='bodyinput' name='body' class='form-control' type='text' placeholder='Your Thought'></textarea>");

      // A button to submit a new thought, with the id of the article saved to it
      $("#thoughtsFooter").append("<button data-id='" + data._id + "' id='savethought'>Save Thought</button>");
      $('#myModal').modal("toggle");

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
      $('#thoughtsFooter').empty();
    });
    $('#myModal').modal("toggle");
    $("#titleinput").val("");
    $("#bodyinput").val("");
});