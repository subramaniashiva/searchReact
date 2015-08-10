// Listening to search box press event and toggle the search result accordingly
$("#search-box").on("keyup", function(event) {
  if(this.value === "") {
    $("#search-list").hide();
  } else {
    $("#search-list").show();
  }
});
// Hide the search results when the user moves away from search box
$("#search-box").on("focusout", function(event){
  $("#search-list").hide();
});